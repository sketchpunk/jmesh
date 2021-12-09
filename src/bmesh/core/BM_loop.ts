import type BMesh       from '../BMesh';
import type BVert       from '../BVert';
import type { BEdge }   from '../BEdge';
import type BLoop       from '../BLoop';
import type BFace       from '../BFace';


function bm_loop_create( bm: BMesh, v : BVert, e : BEdge, f: BFace,): BLoop {

    let l : BLoop = bm._newLoop();

    l.v             = v.idx;
    l.e             = e.idx;
    l.f             = f.idx;
    
    l.radial_next   = -1;
    l.radial_prev   = -1;
    l.next          = -1;
    l.prev          = -1;

    //may add to middle of the pool 
    //bm->elem_index_dirty |= BM_LOOP;
    //bm->spacearr_dirty |= BM_SPACEARR_DIRTY_ALL;
    
    bm.totloop++;
    return l;
}

export {
    bm_loop_create,
};