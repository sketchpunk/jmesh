// https://github.com/dfelinto/blender/blob/master/source/blender/bmesh/intern/bmesh_core.c#L58

//#region IMPORTS
import type BMesh                   from '../BMesh';
import type { BEdge, BMDiskLink }   from '../BEdge';
import type BVert                   from '../BVert';
import { BM_edge_kill }             from './BM_edge';
//#endregion

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

function BM_vert_kill( bm: BMesh, v: BVert ): void{
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if( v.e != -1 ){
        // Delete all Edges the Vertex is attached to
        //let lnk     : BMDiskLink | null; // Disk Constains Circular Linked List of Vert Edges

        while( v.e != -1 ){
        //for( let i=0; i < 10; i++ ){
            //if( v.e == -1 ) break;
            //console.log( "edge", v.e );
            BM_edge_kill( bm, bm.edges[ v.e ] );
        }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    bm_kill_only_vert( bm, v );
}

function bm_kill_only_vert( bm: BMesh, v: BVert ): void{
    bm.totvert--;
    v.reset();
    bm.recycled_v.push( v.idx );
    //TODO handle clearing the vert index.
}

export {
    BM_vert_create,
    BM_vert_in_edge,
    BM_vert_kill,
};