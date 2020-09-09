import { v1 as uuid} from 'uuid';

export const updateSquare = (update)=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        const firestore = getFirestore();
        console.log(update);
        firestore.collection('squares').doc('data').update({squares: update.data})
        .then(()=>{ console.log('updateSquare success') })
        .catch((err)=>{ console.log('err=>', err.message) })
    }
}

export const resetSquareCollection = ()=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        const firestore = getFirestore();
        var tot=100;
        var squares = Array(tot).fill({val:null});
        firestore.collection('squares').doc('data').set({squares})
        .then(()=>{
            firestore.collection('config').doc('configDoc').set({uid: uuid()})
        })
        .catch((err)=>{ console.log('err=>', err.message) })
    }
}
