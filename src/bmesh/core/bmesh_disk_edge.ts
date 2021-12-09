import { BEdge, BMDiskLink }    from '../BEdge';
import BMesh                    from '../BMesh';
import BVert                    from '../BVert';
import { BM_vert_in_edge }      from './BM_vert';


function bmesh_disk_edge_next( bm:BMesh, e: BEdge, v: BVert ): BEdge | null{
    if( !BM_vert_in_edge( e, v ) ) return null;

    if( v.idx == e.v1 && e.v1_disk_link.next != -1 ) return bm.edges[ e.v1_disk_link.next ];
    if( v.idx == e.v2 && e.v2_disk_link.next != -1 ) return bm.edges[ e.v2_disk_link.next ];

    return null;
}

function bmesh_disk_edge_prev( bm:BMesh, e: BEdge, v: BVert ): BEdge | null{
    if( !BM_vert_in_edge( e, v ) ) return null;

    if( v.idx == e.v1 && e.v1_disk_link.prev != -1 ) return bm.edges[ e.v1_disk_link.prev ];
    if( v.idx == e.v2 && e.v2_disk_link.prev != -1 ) return bm.edges[ e.v2_disk_link.prev ];

    return null;
}

function bmesh_disk_edge_append( bm: BMesh, e:BEdge, v: BVert ): void{
    // Vert not assigned an edge
    if( v.e == -1 ){
        const dl1   = bmesh_disk_edge_link_from_vert( e, v ); // Get Disk Cycle for this vert.
        if( !dl1 ) return;

        v.e         = e.idx;    // Assign Edge
        dl1.next    = e.idx;    // Begin Disk Cycle
        dl1.prev    = e.idx;    // ... circular
    }else{
        const dl1 = bmesh_disk_edge_link_from_vert( e, v );
        const dl2 = bmesh_disk_edge_link_from_vert( bm.edges[ v.e ], v );
        const dl3 = ( dl2 && dl2.prev != -1 )? bmesh_disk_edge_link_from_vert( bm.edges[ dl2.prev ], v ) : null;
        
        if( dl1 && dl2 ){
            dl1.next = v.e;
            dl1.prev = dl2.prev;
            dl2.prev = e.idx;
        }

        if( dl3 ) dl3.next = e.idx;
    }
}

function bmesh_disk_edge_link_from_vert( e: BEdge, v: BVert ): BMDiskLink | null{
    if( !BM_vert_in_edge( e, v ) ) return null;
    // Which Disk Cycle are we looking for?
    return ( e.v2 == v.idx )? e.v2_disk_link : e.v1_disk_link;
}

function bmesh_disk_edge_remove( bm:BMesh, e: BEdge, v: BVert ): void {
    let dl1: BMDiskLink | null;
    let dl2: BMDiskLink | null;

    dl1 = bmesh_disk_edge_link_from_vert( e, v );
    if( dl1 && dl1.prev != -1 ){
        dl2 = bmesh_disk_edge_link_from_vert( bm.edges[ dl1.prev ], v );
        if( dl2 ) dl2.next = dl1.next;
    }

    if( dl1 && dl1.next != -1 ){
        dl2 = bmesh_disk_edge_link_from_vert( bm.edges[ dl1.next ], v);
        if( dl2 ) dl2.prev = dl1.prev;
    }

    if( v.e == e.idx){
        v.e = ( dl1 && e.idx != dl1.next )? dl1.next : -1;
    }

    if( dl1 ){
        dl1.next = -1
        dl1.prev = -1;
    }
}

export {
    bmesh_disk_edge_next,
    bmesh_disk_edge_prev,
    bmesh_disk_edge_append,
    bmesh_disk_edge_remove,
    bmesh_disk_edge_link_from_vert,
};

/*
BMEdge *bmesh_disk_edge_exists(const BMVert *v1, const BMVert *v2)
{
  BMEdge *e_iter, *e_first;

  if (v1->e) {
    e_first = e_iter = v1->e;

    do {
      if (BM_verts_in_edge(v1, v2, e_iter)) {
        return e_iter;
      }
    } while ((e_iter = bmesh_disk_edge_next(e_iter, v1)) != e_first);
  }

  return NULL;
}

int bmesh_disk_count(const BMVert *v)
{
  int count = 0;
  if (v->e) {
    BMEdge *e_first, *e_iter;
    e_iter = e_first = v->e;
    do {
      count++;
    } while ((e_iter = bmesh_disk_edge_next(e_iter, v)) != e_first);
  }
  return count;
}
*/