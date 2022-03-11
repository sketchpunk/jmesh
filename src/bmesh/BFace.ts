/*
typedef struct BMFace {
BMHeader head;

#ifdef USE_BMESH_HOLES
int totbounds; total boundaries, is one plus the number of holes in the face
ListBase loops;
#else
BMLoop *l_first;
#endif
*
    * Number of vertices in the face
    * (the length of #BMFace.l_first circular linked list).
    
int len;
float no[3];   face normal 
short mat_nr;  material index 
//  short _pad[3];
} BMFace;
*/

class BFace{
    recycled            = false;
    idx     : number    = -1;
    l_first : number    = -1;
    len     : number    = 0;        // Length of Circular Linked List
    no      : number[]  = [0,0,0];  // face normal

    reset(){
        this.recycled    = true;
        this.l_first     = -1;
        this.len         = 0;
        this.no[ 0 ]     = 0;
        this.no[ 1 ]     = 0;
        this.no[ 2 ]     = 0;
    }
}

export default BFace;