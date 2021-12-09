import type { BEdge }    from '../BEdge';
import type BLoop        from '../BLoop';
import type BMesh        from '../BMesh';

function bmesh_radial_loop_append( bm:BMesh, e: BEdge, l: BLoop ): void{
    if( e.l == -1 ){
        e.l             = l.idx;
        l.radial_next   = l.idx;
        l.radial_prev   = l.idx;
    }else{
        l.radial_prev = e.l;
        l.radial_next = bm.loops[ e.l ].radial_next;

        const el        = bm.loops[ e.l ];
        const eln       = bm.loops[ el.radial_next ];
        eln.radial_prev = l.idx;    // e->l->radial_next->radial_prev = l;
        el.radial_next  = l.idx;    // e->l->radial_next = l;
        e.l             = l.idx;
    }

    //if (UNLIKELY(l->e && l->e != e)) {
        /* l is already in a radial cycle for a different edge */
    //    BMESH_ASSERT(0);
    //}

    l.e = e.idx;
}


export {
    bmesh_radial_loop_append,
};