/*
typedef struct BMLoop {
    BMHeader head;
        notice no flags layer 

    *
        * The vertex this loop points to.
        *
        * - This vertex must be unique within the cycle.
        
    struct BMVert *v;

    *
        * The edge this loop uses.
        *
        * Vertices (#BMLoop.v & #BMLoop.next.v) always contain vertices from (#BMEdge.v1 & #BMEdge.v2).
        * Although no assumptions can be made about the order,
        * as this isn't meaningful for mesh topology.
        *
        * - This edge must be unique within the cycle (defined by #BMLoop.next & #BMLoop.prev links).
        
    struct BMEdge *e;
    *
        * The face this loop is part of.
        *
        * - This face must be shared by all within the cycle.
        *   Used as a back-pointer so loops can know the face they define.
        
    struct BMFace *f;

    *
        * Other loops connected to this edge,.
        *
        * This is typically use for accessing an edges faces,
        * however this is done by stepping over it's loops.
        *
        * - This is a circular list, so there are no first/last storage of the "radial" data.
        *   Instead #BMEdge.l points to any one of the loops that use it.
        *
        * - Since the list is circular, the particular loop referenced doesn't matter,
        *   as all other loops can be accessed from it.
        *
        * - Every loop in this radial list has the same value for #BMLoop.e.
        *
        * - The value for #BMLoop.v might not match the radial next/previous
        *   as this depends on the face-winding.
        *   You can be sure #BMLoop.v will either #BMEdge.v1 or #BMEdge.v2 of #BMLoop.e,
        *
        * - Unlike face-winding (which defines if the direction the face points),
        *   next and previous are insignificant. The list could be reversed for example,
        *   without any impact on the topology.
        *
        * This is an example of looping over an edges faces using #BMLoop.radial_next.
        *
        * \code{.c}
        * BMLoop *l_iter = edge->l;
        * do {
        *   operate_on_face(l_iter->f);
        * } while ((l_iter = l_iter->radial_next) != edge->l);
        * \endcode
        
    struct BMLoop *radial_next, *radial_prev;

    *
        * Other loops that are part of this face.
        *
        * This is typically used for accessing all vertices/edges in a faces.
        *
        * - This is a circular list, so there are no first/last storage of the "cycle" data.
        *   Instead #BMFace.l_first points to any one of the loops that are part of this face.
        *
        * - Since the list is circular, the particular loop referenced doesn't matter,
        *   as all other loops can be accessed from it.
        *
        * - Every loop in this "cycle" list has the same value for #BMLoop.f.
        *
        * - The direction of this list defines the face winding.
        *   Reversing the list flips the face.
        *
        * This is an example loop over all vertices and edges of a face.
        *
        * \code{.c}
        * BMLoop *l_first, *l_iter;
        * l_iter = l_first = BM_FACE_FIRST_LOOP(f);
        * do {
        *   operate_on_vert(l_iter->v);
        *   operate_on_edge(l_iter->e);
        * } while ((l_iter = l_iter->next) != l_first);
        * \endcode
        
    struct BMLoop *next, *prev;
} BMLoop;
*/

class BLoop{
    idx         : number = -1;
    v           : number = -1;
    e           : number = -1;
    f           : number = -1;
    radial_prev : number = -1;
    radial_next : number = -1;
    prev        : number = -1;
    next        : number = -1;
}

export default BLoop;