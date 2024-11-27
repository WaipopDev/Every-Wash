import React, { useState, useEffect, createRef } from 'react'
import { connect } from 'react-redux'
import MapPage from '../MapPage'
import { BranchActions } from '../../redux/actions'
export const MapList = (props) => {
    const { getBranch, branchData, permission } = props
    const [position, setPosition] = useState({ latitude: 13.763479, longitude: 100.5181292 });
    const [marker, setMarker] = useState([]);
    useEffect(() => {
        if (!branchData.length) {
            getBranch()
        } else {
            let param = []

            branchData.map((res) => {
                if(permission.length){
                    if(_.find(permission, res1 => res1.docId === res.docId)){
                        param.push({ latitude: res.latitude, longitude: res.longitude })
                    }
                  }else{
                    param.push({ latitude: res.latitude, longitude: res.longitude })
                  }
                
            })
            setMarker(param)
        }
    }, [branchData])
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setPosition({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
        });
    }, [])
    return (
        <div className="w-100 h-100">
            <MapPage position={position} marker={marker} />
        </div>
    )
}

const mapStateToProps = (state) => {
    const {
        user: { data: userData,permission },
        branch: { data: branchData }
    } = state
    return {
        branchData,
        permission
    }
}

const mapDispatchToProps = {
    getBranch: BranchActions.getBranch
}

export default connect(mapStateToProps, mapDispatchToProps)(MapList)
