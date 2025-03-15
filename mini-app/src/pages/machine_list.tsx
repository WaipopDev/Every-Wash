import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_WEB } from "utils/api";
import { Sheet, Button, Page, Text, useNavigate, List, Icon } from "zmp-ui";

const MachineListPage: React.FunctionComponent = (props) => {
    const [listBranch, setListBranch] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        getDataBranch();
    }, []);

    const getDataBranch = async () => {
        try {
            

            // console.log('process.env.API_WEB', API_WEB)
            const { data } = await axios.get(`${API_WEB}/branch-list`);
            if(data.data){
                setListBranch(data.data);
            }
        } catch (error: any) {
            console.log("getDataBranch error", error);
        }
    };

    return (
        <Page className="page">
            <div className="section-container">
                <Text>List Branch  Machine</Text>
            </div>
            <div className="section-container">
                <List>
                    {listBranch.map((branch: any) => (
                        <List.Item
                            key={branch.id}
                            onClick={() => navigate(`/machine_list/${branch.id}`)}
                            suffix={<Icon icon="zi-arrow-right" />}
                        >
                            <div>{branch.name}</div>
                        </List.Item>
                    ))}
                    
                </List>
            </div>
        </Page>
    );
};

export default MachineListPage;
