import React, { useEffect, useState } from "react";
import { API_WEB } from "utils/api";
import { Sheet, Button, Page, Text, useNavigate, List, Icon, ImageViewer } from "zmp-ui";
import { useLocation } from "react-router-dom";

interface MachineListProps {
    type: string;
    name: string;
    docId: string;
    status: number;
    time: number;
    size: string;
    price: number;
    waterTemperature: string;
}

const MachineListPage: React.FunctionComponent = (props) => {
    const [listMachine, setListMachine] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state.key) {
            getDataMachine(location.state.key);
        }
    }, [location.state]);

    const getDataMachine = (key: string) => {
        fetch(`${API_WEB}/machine-list/${key}`).then((res) => res.json()).then((response) => {
            if (response.data) {
                setListMachine(response.data);
            }
        }).catch((error) => {
            console.log("getDataBranch error", error);
        });
    };

    return (
        <Page className="page">
            <div className="section-container">
                <Text className="font-bold">List Branch  Machine : {location.state?.name || ''}</Text>
            </div>
            <div>
                {listMachine.map((res: MachineListProps) => (
                    <div
                        key={res.docId}
                        className="list-item-container bottom_level_02"
                    >
                        <div className={`${res.type === 'washing-machine' ? 'list-item-icon-1' : 'list-item-icon-2'}`}>
                            <img
                                style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                // role="presentation"
                                src={'https://firebasestorage.googleapis.com/v0/b/every-wash-e4751.firebasestorage.app/o/mini-app%2Fwashing-machine.png?alt=media&token=aa19e745-7e10-4f47-b7df-228c5608a001'}
                                alt={'img'}
                            />
                        </div>
                        <div className="list-item-content">
                            <Text className="list-item-title">{res.type === 'washing-machine' ? 'Washer' : 'Dryer'} : {res.size} Kg. {res.name}</Text>
                            <Text className="list-item-subtitle">Price : {res.price}</Text>
                            <Text className={`list-item-subtitle flex`}>Status :<Text className={`${res.status === 1 ? 'status-1' : 'status-2'}`}>{res.status === 1 ? 'Available' : 'Working'}</Text></Text>
                            <Text className="list-item-subtitle">Time : {res.time} Min</Text>
                            <Text className="list-item-subtitle">Water Temperature : {res.waterTemperature} °C</Text>
                        </div>
                    </div>
                ))}
            </div>
            <Button
                variant="secondary"
                fullWidth
                onClick={() => navigate(-1)}
            >
                Back
            </Button>
        </Page>
    );
};

export default MachineListPage;
