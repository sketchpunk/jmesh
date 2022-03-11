 
/*
// disk link structure, only used by edges
typedef struct BMDiskLink {
    struct BMEdge *next, *prev;
  } BMDiskLink;

typedef struct BMEdge {
  BMHeader head;

   * Vertices (unordered),
   *
   * Although the order can be used at times,
   * when extruding a face from a wire-edge for example.
   *
   * Operations that create/subdivide edges shouldn't flip the order
   * unless there is a good reason to do so.
   BMVert *v1, *v2;

    * The list of loops around the edge, see doc-string for #BMLoop.radial_next
    * for an example of using this to loop over all faces used by an edge.
   struct BMLoop *l;
 
    * Disk Cycle Pointers
    *
    * relative data: d1 indicates indicates the next/prev
    * edge around vertex v1 and d2 does the same for v2.

   BMDiskLink v1_disk_link, v2_disk_link;
 } BMEdge;
*/

import type BVert from "./BVert";

class BMDiskLink {
    next : number = -1;
    prev : number = -1;
}

class BEdge{
    recycled     = false;
    idx : number = -1;
    v1  : number = -1;   // Vertex 1 Index
    v2  : number = -1;   // Vertex 2 INdex
    l   : number = -1;   // Loop Index

    // Disk Cycle Pointers - A circle of edges around a vertex
    v1_disk_link = new BMDiskLink();
    v2_disk_link = new BMDiskLink();

    getDiskLink( v: BVert ): BMDiskLink | null{
        if( v.idx == this.v1 ) return this.v1_disk_link;
        if( v.idx == this.v2 ) return this.v2_disk_link;
        return null;
    }

    reset(){
        this.recycled           = true;
        this.l                  = -1;
        this.v1                 = -1;
        this.v2                 = -1;
        this.v1_disk_link.next  = -1;
        this.v1_disk_link.prev  = -1;
        this.v2_disk_link.next  = -1;
        this.v2_disk_link.prev  = -1;
    }
}

export { BEdge, BMDiskLink };