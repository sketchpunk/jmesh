/*
typedef struct BMVert {
    BMHeader head;

    float co[3]; // vertex coordinates
    float no[3]; // vertex normal


    * Pointer to (any) edge using this vertex (for disk cycles).
    *
    * \note Some higher level functions set this to different edges that use this vertex,
    * which is a bit of an abuse of internal #BMesh data but also works OK for now
    * (use with care!).
    struct BMEdge *e;
} BMVert;
*/

class BVert{
    idx : number    = -1;
    co  : number[]  = [0,0,0];
    e   : number    = -1;

    constructor( co ?: number[] ){
        if( co ) this.setCo( co );
    }

    setCo( co: number[] ){
        this.co[0] = co[0];
        this.co[1] = co[1];
        this.co[2] = co[2];
    }
}

export default BVert;