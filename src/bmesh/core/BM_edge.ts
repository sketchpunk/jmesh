import type BMesh from '../BMesh';
import type BVert from '../BVert';

import { BEdge }                    from "../BEdge";
import { BM_vert_in_edge }          from './BM_vert';
import { bmesh_disk_edge_append, 
         bmesh_disk_edge_next, 
         bmesh_disk_edge_remove}     from './bmesh_disk_edge';
import BLoop from '../BLoop';
import { BM_face_kill } from './BM_face';


// https://github.com/dfelinto/blender/blob/master/source/blender/bmesh/intern/bmesh_core.c#L147
function BM_edge_create( bm: BMesh, v1: BVert, v2: BVert ): BEdge | null{
    if( v1 === v2 ){ console.log( "edge create : vertices the same" ); return null; }

    let e = BM_edge_exists( bm, v1, v2 );
    if( e ) return e;

    e       = bm._newEdge();
    e.v1    = v1.idx;
    e.v2    = v2.idx;
    e.l     = -1;

    //bm->elem_index_dirty |= BM_EDGE;
    //bm->elem_table_dirty |= BM_EDGE;
    //bm->spacearr_dirty |= BM_SPACEARR_DIRTY_ALL;

    bmesh_disk_edge_append( bm, e, v1 );
    bmesh_disk_edge_append( bm, e, v2 );

    bm.totedge++;
    return e;
}

function BM_edge_exists( bm: BMesh, v_a: BVert, v_b: BVert ): BEdge | null{
    if( v_a === v_b || v_a.e == -1 || v_b.e == -1  ) return null;

    let e_a = bm.edges[ v_a.e ];        // Starting Edges, Keep for testing circular ending
    let e_b = bm.edges[ v_b.e ];
    let e_a_iter: BEdge | null = e_a;   // Circular Steps
    let e_b_iter: BEdge | null = e_b;

    do{
        if( e_a_iter ){
            if( BM_vert_in_edge( e_a_iter, v_b ) ) return e_a_iter;
            e_a_iter = bmesh_disk_edge_next( bm, e_a_iter, v_a );
        }

        if( e_b_iter ){
            if( BM_vert_in_edge( e_b_iter, v_a ) ) return e_b_iter;
            e_b_iter = bmesh_disk_edge_next( bm, e_b_iter, v_b );
        }
    } while( 
        e_a_iter && e_a_iter != e_a && 
        e_b_iter && e_b_iter != e_b 
    );

    return null;
}

/**Fill in an edge array from a vertex array (connected polygon loop).
 * \returns false if any edges aren't found. */
function BM_edges_from_verts( bm: BMesh, edge_arr: BEdge[], vert_arr: BVert[], len: number ): Boolean{
    let i_prev  : number = len - 1;
    let e       : BEdge | null;

    for( let i = 0; i < len; i++) {
        e = BM_edge_exists( bm, vert_arr[ i_prev ], vert_arr[ i ] );
        if( !e ) return false;

        edge_arr[ i_prev ]  = e;
        i_prev              = i;
    }
    
    return true;
}

/** Fill in an edge array from a vertex array (connected polygon loop).
 * Creating edges as-needed. */
function BM_edges_from_verts_ensure( bm: BMesh, edge_arr: BEdge[], vert_arr: BVert[], len: number ): void{
    let i_prev = len - 1;
    let e : BEdge | null;
    for( let i = 0; i < len; i++ ){
        e = BM_edge_create( bm, vert_arr[ i_prev ], vert_arr[ i ] );
        if( e ) edge_arr[ i_prev ] = e;

        i_prev = i;
    }
}


function BM_edge_kill( bm: BMesh, e: BEdge ): void{
    let l: BLoop;
    while( e.l != -1 ){
        l = bm.loops[ e.l ];
        BM_face_kill( bm, bm.faces[ l.f ] );
    }

    bmesh_disk_edge_remove( bm, e, bm.vertices[ e.v1 ] );
    bmesh_disk_edge_remove( bm, e, bm.vertices[ e.v2 ] );

    bm_kill_only_edge( bm, e );
  
    /*
    do{
        console.log( 'loop', l );
        
        if( l.radial_next == -1 ){ console.log( 'loop has -1 next' ); break; }
        l = bm.loops[ l.radial_next ];

    } while( l.idx != iStart );
    */
}

function bm_kill_only_edge( bm: BMesh, e: BEdge ): void{
    bm.totedge--;
    e.reset();
    bm.recycled_e.push( e.idx );
}


/**
 * kills \a e and all faces that use it.

 void BM_edge_kill(BMesh *bm, BMEdge *e)
 {
   while (e->l) {
     BM_face_kill(bm, e->l->f);
   }
 
   bmesh_disk_edge_remove(e, e->v1);
   bmesh_disk_edge_remove(e, e->v2);
 
   bm_kill_only_edge(bm, e);
 }
*/

export { 
    BM_edge_create,
    BM_edge_exists,
    BM_edges_from_verts,
    BM_edges_from_verts_ensure,
    BM_edge_kill,
    bm_kill_only_edge,
};