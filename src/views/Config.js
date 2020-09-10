import React, { useState, useEffect } from 'react'
import { compose } from 'redux'
import { connect, useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'
import { resetSquareCollection, updateConfig } from '../store/actions/action'
import 'materialize-css'
import { TextInput } from 'react-materialize'

function Config(props) {
    const {resetSquareCol, updateConfigFn} = props
    useFirestoreConnect({
        collection: 'squares',
        doc: 'data',
    })
    useFirestoreConnect({
        collection: 'config',
        doc: 'configDoc',
    })

    const [teamA, setTeamA] = useState('')
    const [teamB, setTeamB] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');
    const collection = useSelector(state=> state.firestore.ordered.squares);
    const configCol = useSelector(state=> state.firestore.ordered.config);
    useEffect(()=>{
        if(!configCol || configCol.length == 0) return;
        // console.log(configCol[0]);
        setTeamA(configCol[0].teamA ?? '');
        setTeamB(configCol[0].teamB ?? '');
        setDate(configCol[0].date ?? '');
        setTime(configCol[0].time ?? '');
        setMessage(configCol[0].message ?? '');
    },[configCol])
    return (
        <div className="Config">
            <div className="container">
                <div className=" config-input row">
                    <div className="col s12 center">
                        <h5 className="center">Square-App || Config</h5>
                    </div>
                    <div className="col s12 center">
                    <div 
                        onClick={()=>{
                            resetSquareCol();
                        }}
                        className="btn">Reset</div>
                    </div>
                    <div className="col s12 m6">
                        <TextInput 
                        s={12}
                        label='Team A=>'
                        onChange={(e)=>{setTeamA(e.target.value)}}
                        value={teamA} 
                        />
                    </div>
                    <div className="col s12 m6">
                        <TextInput 
                        s={12}
                        label='Team B=>'
                        onChange={(e)=>{setTeamB(e.target.value)}}
                        value={teamB} 
                        />
                    </div>
                    <div className="col s12 m6">
                        <TextInput 
                        s={12}
                        label='Date=>'
                        onChange={(e)=>{setDate(e.target.value)}}
                        value={date} 
                        />
                    </div>
                    <div className="col s12 m6">
                        <TextInput 
                        s={12}
                        label='Time=>'
                        onChange={(e)=>{setTime(e.target.value)}}
                        value={time} 
                        />
                    </div>
                    <div className="col s12">
                        <TextInput 
                        s={12}
                        label='Message=>'
                        onChange={(e)=>{setMessage(e.target.value)}}
                        value={message} 
                        />
                    </div>
                    <div className="col s12 center">
                        <div 
                            onClick={()=>{
                                updateConfigFn({teamA, teamB, date, time, message});
                            }}
                            className="btn">Save</div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

const mapStateToProps = (state)=>{
    // console.log(state)
    return {}
}
const mapDispatchToProps = (dispatch)=>{
    return {
        resetSquareCol: ()=>{dispatch(resetSquareCollection())},
        updateConfigFn: (update)=>{dispatch(updateConfig(update))}
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
) (Config)
