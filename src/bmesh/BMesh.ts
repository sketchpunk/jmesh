/*
typedef struct BMesh {
    int totvert, totedge, totloop, totface;
    int totvertsel, totedgesel, totfacesel;

    *
        * Flag index arrays as being dirty so we can check if they are clean and
        * avoid looping over the entire vert/edge/face/loop array in those cases.
        * valid flags are: `(BM_VERT | BM_EDGE | BM_FACE | BM_LOOP)`
        
    char elem_index_dirty;

    *
        * Flag array table as being dirty so we know when its safe to use it,
        * or when it needs to be re-created.
        
    char elem_table_dirty;

        element pools 
    struct BLI_mempool *vpool, *epool, *lpool, *fpool;

        mempool lookup tables (optional)
        * index tables, to map indices to elements via
        * BM_mesh_elem_table_ensure and associated functions.  don't
        * touch this or read it directly.\
        * Use BM_mesh_elem_table_ensure(), BM_vert/edge/face_at_index() 
    BMVert **vtable;
    BMEdge **etable;
    BMFace **ftable;

        size of allocated tables 
    int vtable_tot;
    int etable_tot;
    int ftable_tot;

        operator api stuff (must be all NULL or all alloc'd) 
    struct BLI_mempool *vtoolflagpool, *etoolflagpool, *ftoolflagpool;

    uint use_toolflags : 1;

    int toolflag_index;

    CustomData vdata, edata, ldata, pdata;

    #ifdef USE_BMESH_HOLES
    struct BLI_mempool *looplistpool;
    #endif

    struct MLoopNorSpaceArray *lnor_spacearr;
    char spacearr_dirty;

        Should be copy of scene select mode. 
        Stored in #BMEditMesh too, this is a bit confusing,
        * make sure they're in sync!
        * Only use when the edit mesh cant be accessed - campbell 
    short selectmode;

        ID of the shape key this bmesh came from 
    int shapenr;

    int totflags;
    ListBase selected;

    *
        * The active face.
        * This is kept even when unselected, mainly so UV editing can keep showing the
        * active faces image while the selection is being modified in the 3D viewport.
        *
        * Without this the active image in the UV editor would flicker in a distracting way
        * while changing selection in the 3D viewport.
        
    BMFace *act_face;

    * List of #BMOpError, used for operator error handling. 
    ListBase errorstack;

    *
        * Keep a single reference to the Python instance of this #BMesh (if any exists).
        *
        * This allows save invalidation of a #BMesh when it's freed,
        * so the Python object will report it as having been removed,
        * instead of crashing on invalid memory access.
        
    void *py_handle;
} BMesh;
*/

import BVert                    from './BVert';
import { BEdge }                from './BEdge';
import BLoop                    from './BLoop';
import BFace                    from './BFace';
import { BM_vert_create }       from './core/BM_vert';
import { BM_edge_create }       from './core/BM_edge';
import { BM_face_create_verts } from './core/BM_face';


const BM_VERT = 1;
const BM_EDGE = 2;
const BM_LOOP = 4;
const BM_FACE = 8;

class BMesh {
    //#region MAIN
    // int totvertsel, totedgesel, totfacesel;

    totvert : number = 0;
    totedge : number = 0;
    totloop : number = 0;
    totface : number = 0;

    // Flag index arrays as being dirty so we can check if they are clean and
    // avoid looping over the entire vert/edge/face/loop array in those cases.
    // valid flags are: `(BM_VERT | BM_EDGE | BM_FACE | BM_LOOP)`      
    //elem_index_dirty = 0;

    // Flag array table as being dirty so we know when its safe to use it,
    // or when it needs to be re-created.        
    //elem_table_dirty = 0;

    vertices    : BVert[] = [];
    edges       : BEdge[] = [];
    loops       : BLoop[] = [];
    faces       : BFace[] = [];

    recycled_v  : number[] = [];    // Indices of recycled objects in their respected pools
    recycled_e  : number[] = [];
    recycled_l  : number[] = [];
    recycled_f  : number[] = [];

    // index tables, to map indices to elements via
    // BM_mesh_elem_table_ensure and associated functions.  don't
    // touch this or read it directly.\
    // Use BM_mesh_elem_table_ensure(), BM_vert/edge/face_at_index() 
    //vtable = [];
    //etable = [];
    //ftable = [];

    //#endregion

    //#region POOLS
    _newVert(): BVert{
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if( this.recycled_v.length != 0 ){
            const i = this.recycled_v.pop();
            if( i != undefined ){
                const o     = this.vertices[ i ];
                o.recycled  = false;
                return o;
            }
        }
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const o = new BVert();
        o.idx   = this.vertices.length;
        this.vertices.push( o );
        return o;
    }

    _newEdge(): BEdge{
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if( this.recycled_e.length != 0 ){
            const i = this.recycled_e.pop();
            if( i != undefined ){
                const o     = this.edges[ i ];
                o.recycled  = false;
                return o;
            }
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const o = new BEdge();
        o.idx   = this.edges.length;
        this.edges.push( o );
        return o;
    }

    _newLoop(): BLoop{
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if( this.recycled_l.length != 0 ){
            const i = this.recycled_l.pop();
            if( i != undefined ){
                const o     = this.loops[ i ];
                o.recycled  = false;
                return o;
            }
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const o = new BLoop();
        o.idx   = this.loops.length;
        this.loops.push( o );
        return o;
    }

    _newFace(): BFace{
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if( this.recycled_f.length != 0 ){
            const i = this.recycled_f.pop();
            if( i != undefined ){
                const o     = this.faces[ i ];
                o.recycled  = false;
                return o;
            }
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const o = new BFace();
        o.idx   = this.faces.length;
        this.faces.push( o );
        return o;
    }
    //#endregion

    //#region ABSTRACTION
    newVert( co:number[] ): BVert{ return BM_vert_create( this, co ); }
    newEdge( a: BVert, b: BVert ): BEdge | null{ return BM_edge_create( this, a, b ); }
    newFace( vertAry: BVert[] ): BFace | null{
        //BM_face_create( bm, [a,b,c,d], [e0,e1,e2,e3], 4 );
        return BM_face_create_verts( this, vertAry, vertAry.length );
    }
    //#endregion
}

export default BMesh;