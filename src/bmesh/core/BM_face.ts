//#region IMPORTS
import type BMesh       from '../BMesh';
import type BFace       from '../BFace';
import type BVert       from '../BVert';
import type { BEdge }   from '../BEdge';
import type BLoop       from '../BLoop';

import { bm_loop_create,
         bm_kill_only_loop, }           from './BM_loop';

import { bmesh_radial_loop_append,
         bmesh_radial_loop_remove, }    from './bmesh_radial_loop';

import { bmesh_disk_edge_next }         from './bmesh_disk_edge';

import { BM_edges_from_verts, 
         BM_edges_from_verts_ensure, }  from './BM_edge';
//#endregion

// Wrapper for #BM_face_create when you don't have an edge array
function BM_face_create_verts( bm: BMesh, vert_arr: BVert[], len: number, create_edges=true ): BFace | null{
    const edge_arr : BEdge[] = new Array( len );

    if( create_edges ){
        BM_edges_from_verts_ensure( bm, edge_arr, vert_arr, len );
    }else{
        if( BM_edges_from_verts( bm, edge_arr, vert_arr, len ) == false ) return null;
    }

    return BM_face_create(bm, vert_arr, edge_arr, len );
}

function BM_face_create( bm: BMesh, verts: BVert[], edges: BEdge[], len: number  ): BFace{
    let f: BFace | null;

    f = BM_face_exists( bm, verts, len );
    if( f ) return f;
    
    f = bm._newFace();

    let l      : BLoop;
    let startl : BLoop = bm_face_boundary_add( bm, f, verts[ 0 ], edges[ 0 ] );
    let lastl          = startl;

    for( let i = 1; i < len; i++) {
      l = bm_loop_create( bm, verts[ i ], edges[ i ], f );
  
      bmesh_radial_loop_append( bm, edges[ i ], l );
  
      l.prev        = lastl.idx;
      lastl.next    = l.idx;
      lastl         = l;
    }

    startl.prev = lastl.idx;
    lastl.next  = startl.idx;
    f.len       = len;

    bm.totface++;
    return f;
}

function bm_face_boundary_add( bm: BMesh, f: BFace, startv: BVert, starte: BEdge ): BLoop{
    let l = bm_loop_create( bm, startv, starte, f );

    bmesh_radial_loop_append( bm, starte, l );
  
    f.l_first = l.idx;
    
    return l;
}

function BM_face_exists( bm: BMesh, varr: BVert[], len: number ): BFace | null{
    if( varr[0].e != -1 ){
        let l_iter_radial   : BLoop;
        let l_first_radial  : BLoop;
        let f               : BFace;

        let e_iter  : BEdge | null = bm.edges[ varr[ 0 ].e ];
        let e_first : BEdge | null = e_iter;

        /* would normally use BM_LOOPS_OF_VERT, but this runs so often,
        * its faster to iterate on the data directly */
        do{
            if( e_iter && e_iter.l != -1 ) {
                
                l_iter_radial   = bm.loops[ e_iter.l ];
                l_first_radial  = l_iter_radial;

                do {
                    if( l_iter_radial.v == varr[0].idx && bm.faces[ l_iter_radial.f ].len == len ) {
                        /* the first 2 verts match, now check the remaining (len - 2) faces do too
                        * winding isn't known, so check in both directions */
                        let i_walk = 2;

                        if( bm.loops[ l_iter_radial.next ].v == varr[ 1 ].idx ){

                            let l_walk = bm.loops[ bm.loops[ l_iter_radial.next ].next ];
                            do{
                                if( l_walk.v != varr[ i_walk ].idx ) break;
                            }while( l_walk.next != -1, (l_walk = bm.loops[ l_walk.next ]), ++i_walk != len );
                        
                        }else if( bm.loops[ l_iter_radial.prev ].v == varr[ 1 ].idx ){

                            let l_walk = bm.loops[ bm.loops[ l_iter_radial.prev ].prev ];
                            do{
                                if( l_walk.v != varr[ i_walk ].idx ) break;
                            }while( l_walk.prev != -1, (l_walk = bm.loops[ l_walk.prev ] ), ++i_walk != len );

                        }

                        if( i_walk == len ) return bm.faces[ l_iter_radial.f ];
                    }
                }while( 
                    ( l_iter_radial = bm.loops[ l_iter_radial.radial_next ] ) != l_first_radial
                );
            }

            if( e_iter ) e_iter = bmesh_disk_edge_next( bm, e_iter, varr[ 0 ] );
        } while( e_iter != null && e_iter != e_first );
    }

    return null;
}

function BM_face_kill( bm: BMesh, f: BFace ): void{
    if( f.l_first != -1 ){
        let l_iter  : BLoop = bm.loops[ f.l_first ];
        let l_next  : BLoop = l_iter;
        let l_first : BLoop = l_iter;

        do {
            l_next = bm.loops[ l_iter.next ];

            bmesh_radial_loop_remove( bm, bm.edges[ l_iter.e ], l_iter );
            bm_kill_only_loop( bm, l_iter );

        } while( (l_iter = l_next) != l_first );
    }

    bm_kill_only_face( bm, f );
}

function bm_kill_only_face( bm: BMesh, f: BFace ): void{
    bm.totface--;
    f.reset();
    bm.recycled_f.push( f.idx );
}

export {
    BM_face_create_verts,
    BM_face_create,
    bm_face_boundary_add,
    BM_face_exists,
    BM_face_kill,
    bm_kill_only_face,
};



 /**
  * A version of #BM_face_kill which removes edges and verts
  * which have no remaining connected geometry.

 void BM_face_kill_loose(BMesh *bm, BMFace *f)
 {
 #ifdef USE_BMESH_HOLES
   BMLoopList *ls, *ls_next;
 #endif
 
   BM_CHECK_ELEMENT(f);
 
 #ifdef USE_BMESH_HOLES
   for (ls = f->loops.first; ls; ls = ls_next)
 #else
   if (f->l_first)
 #endif
   {
     BMLoop *l_iter, *l_next, *l_first;
 
 #ifdef USE_BMESH_HOLES
     ls_next = ls->next;
     l_iter = l_first = ls->first;
 #else
     l_iter = l_first = f->l_first;
 #endif
 
     do {
       BMEdge *e;
       l_next = l_iter->next;
 
       e = l_iter->e;
       bmesh_radial_loop_remove(e, l_iter);
       bm_kill_only_loop(bm, l_iter);
 
       if (e->l == NULL) {
         BMVert *v1 = e->v1, *v2 = e->v2;
 
         bmesh_disk_edge_remove(e, e->v1);
         bmesh_disk_edge_remove(e, e->v2);
         bm_kill_only_edge(bm, e);
 
         if (v1->e == NULL) {
           bm_kill_only_vert(bm, v1);
         }
         if (v2->e == NULL) {
           bm_kill_only_vert(bm, v2);
         }
       }
     } while ((l_iter = l_next) != l_first);
 
 #ifdef USE_BMESH_HOLES
     BLI_mempool_free(bm->looplistpool, ls);
 #endif
   }
 
   bm_kill_only_face(bm, f);
 }  */


/*

float BM_face_calc_normal(const BMFace *f, float r_no[3])
{
  BMLoop *l;

  // common cases first
  switch (f->len) {
    case 4: {
      const float *co1 = (l = BM_FACE_FIRST_LOOP(f))->v->co;
      const float *co2 = (l = l->next)->v->co;
      const float *co3 = (l = l->next)->v->co;
      const float *co4 = (l->next)->v->co;

      return normal_quad_v3(r_no, co1, co2, co3, co4);
    }
    case 3: {
      const float *co1 = (l = BM_FACE_FIRST_LOOP(f))->v->co;
      const float *co2 = (l = l->next)->v->co;
      const float *co3 = (l->next)->v->co;

      return normal_tri_v3(r_no, co1, co2, co3);
    }
    default: {
      return bm_face_calc_poly_normal(f, r_no);
    }
  }
}

*/