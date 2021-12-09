 
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

class BMDiskLink {
    next : number = -1;
    prev : number = -1;
}

class BEdge{
    idx : number = -1;
    v1  : number = -1;   // Vertex 1 Index
    v2  : number = -1;   // Vertex 2 INdex
    l   : number = -1;   // Loop Index

    // Disk Cycle Pointers - A circle of edges around a vertex
    v1_disk_link = new BMDiskLink();
    v2_disk_link = new BMDiskLink();
}

export { BEdge, BMDiskLink };