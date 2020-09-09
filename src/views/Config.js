import React from 'react'
import { compose } from 'redux'
import { connect, useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'
import { resetSquareCollection } from '../store/actions/action'

function Config(props) {
    const {resetSquareCol} = props
    useFirestoreConnect({
        collection: 'squares',
        doc: 'data',
    })
    const collection = useSelector(state=> state.firestore.ordered.squares);
    return (
        <div className="Config">
            <div className="container">
                <div className="center">
                    <div 
                    onClick={()=>{
                        resetSquareCol();
                    }}
                    className="btn">Reset</div>
                </div>
                <h5 className="center">Square App || Config</h5>
                {JSON.stringify(collection,null,4)}
            </div>
        </div>
    )
}

const mapStateToProps = (state)=>{
    console.log(state)
    return {}
}
const mapDispatchToProps = (dispatch)=>{
    return {
        resetSquareCol: ()=>{dispatch(resetSquareCollection())}
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
) (Config)
