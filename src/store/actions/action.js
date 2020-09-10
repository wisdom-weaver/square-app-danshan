import { v1 as uuid} from 'uuid';

export const updateSquare = (update)=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        const firestore = getFirestore();
        // console.log(update);
        firestore.collection('squares').doc('data').update({squares: update.data})
        .then(()=>{ 
            // console.log('updateSquare success') 
        })
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
            firestore.collection('config').doc('configDoc').update({uid: uuid()})
        })
        .catch((err)=>{ console.log('err=>', err.message) })
    }
}

export const resetSingleSqAction = (singleSq)=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        const firestore = getFirestore();
        firestore.collection('squares').doc('data').get()
        .then((doc)=>{
            var squares = doc.data().squares;
            // console.log(squares);
            var indexAr = singleSq.trim().split('-');
            var index = parseInt(indexAr[0]*10)+parseInt(indexAr[1]);
            var newSquares = new Array(...squares);
            newSquares[index] = {val:null};
            // console.log(newSquares);
            firestore.collection('squares').doc('data').update({squares: newSquares})
        });
    }
}

export const updateConfig = (update)=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        const firestore = getFirestore();
        firestore.collection('config').doc('configDoc').update(update)
        .then(()=>{ 
            // console.log('uploaded') 
        })
        .catch((err)=>{ console.log('err=>', err.message) })
    }
}

