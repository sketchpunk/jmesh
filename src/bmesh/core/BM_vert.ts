// https://github.com/dfelinto/blender/blob/master/source/blender/bmesh/intern/bmesh_core.c#L58

import type BMesh       from '../BMesh';
import type { BEdge }   from '../BEdge';
import BVert            from '../BVert';


function BM_vert_create( bm: BMesh, co: number[] ): BVert{
    const v = bm._newVert();
    v.setCo( co );
    
    //bm->elem_index_dirty |= BM_VERT;
    //bm->elem_table_dirty |= BM_VERT;
    
    bm.totvert++;

    // TODO, Get From Recycled Pool
    return v;
}


function BM_vert_in_edge( e: BEdge , v: BVert ) : Boolean{
    return ( e.v1 == v.idx || e.v2 === v.idx );
}


/**
 * kills \a v and all edges that use it.

 void BM_vert_kill(BMesh *bm, BMVert *v)
 {
   while (v->e) {
     BM_edge_kill(bm, v->e);
   }
 
   bm_kill_only_vert(bm, v);
 }
*/
 

export {
    BM_vert_create,
    BM_vert_in_edge,
};