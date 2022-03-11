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
    recycled        = false;
    idx : number    = -1;       // Vertex Index
    co  : number[]  = [0,0,0];  // Vertex Coordinate
    e   : number    = -1;       // Edge Index

    constructor( co ?: number[] ){
        if( co ) this.setCo( co );
    }

    setCo( co: number[] ){
        this.co[0] = co[0];
        this.co[1] = co[1];
        this.co[2] = co[2];
    }

    reset(){
        this.recycled = true;
        this.e      = -1;
        this.co[0]  = 0;
        this.co[1]  = 0;
        this.co[2]  = 0;
    }
}

export default BVert;