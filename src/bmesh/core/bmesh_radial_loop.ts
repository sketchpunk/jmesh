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

/**
 * \brief BMESH RADIAL REMOVE LOOP
 *
 * Removes a loop from an radial cycle. If edge e is non-NULL
 * it should contain the radial cycle, and it will also get
 * updated (in the case that the edge's link into the radial
 * cycle was the loop which is being removed from the cycle).
 */
function bmesh_radial_loop_remove( bm: BMesh, e: BEdge, l: BLoop ): void{
    if( e.idx != l.e ){
        console.log( 'radial_loop_remove - Edge is not part of loop' );
        return;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if( l.radial_next != l.idx ){
        if( l.idx == e.l ) e.l = l.radial_next;

        bm.loops[ l.radial_next ].radial_prev = l.radial_prev;
        bm.loops[ l.radial_prev ].radial_next = l.radial_next;      
    }else{
        if( l.idx == e.l ) e.l = -1;
        else console.log( 'Loop isnt assigned to edge' );
    }
    
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    /* l is no longer in a radial cycle; empty the links
    * to the cycle and the link back to an edge */
    l.radial_next = -1
    l.radial_prev = -1;
    l.e           = -1;
}


export {
    bmesh_radial_loop_append,
    bmesh_radial_loop_remove,
};