import React from 'react'
import { connect } from 'react-redux'
import GoogleMapReact from 'google-map-react';
import _ from 'lodash';
export const MapPage = (props) => {
    const { onClick, position, marker } = props
    const AnyReactComponent = ({ text }) => (
        <div>
            <i className="fas fa-map-marker-alt marker"></i>
        </div>
    )
    let showMarker = []
    if (!_.isUndefined(marker)) {
        if (_.isArray(marker)) {
            marker.map((res, index) => {
                showMarker.push(
                    <AnyReactComponent
                        key={index}
                        lat={res.latitude}
                        lng={res.longitude}
                        text="My Marker"
                    />
                )
            })
        } else if (!_.isUndefined(marker.latitude) && !_.isUndefined(marker.longitude)) {
            showMarker.push(
                <AnyReactComponent
                    key={'Marker'}
                    lat={marker.latitude}
                    lng={marker.longitude}
                    text="My Marker"
                />
            )

        }
    }


    return (
        <>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyAD9k4gGfvKXpTctbCfmgdnfsEP9k0LKFU' }}
                defaultCenter={{
                    lat: 13.763479,
                    lng: 100.5181292
                }}
                center={{
                    lat: position.latitude || 13.763479,
                    lng: position.longitude || 100.5181292
                }}
                defaultZoom={13}
                yesIWantToUseGoogleMapApiInternals
                onClick={onClick}
            >
                {showMarker}
            </GoogleMapReact>
        </>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(MapPage)
