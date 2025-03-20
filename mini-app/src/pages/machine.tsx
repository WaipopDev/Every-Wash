import React, { useEffect, useState } from "react";
import { API_WEB } from "utils/api";
import { Sheet, Button, Page, Text, useNavigate, List, Icon } from "zmp-ui";

const MachinePage: React.FunctionComponent = (props) => {
    const [listBranch, setListBranch] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        getDataBranch();
    }, []);

    const getDataBranch = () => {
        fetch(`${API_WEB}/branch-list`).then((res) => res.json()).then((response) => {
            if (response.data) {
                setListBranch(response.data);
            }
        }).catch((error) => {
            console.log("getDataBranch error", error);
        });
        // axios.get(`${API_WEB}/branch-list`).then((response) => {
        //     if(response.data.data){
        //         setListBranch(response.data.data);
        //     }
        // }
        // ).catch((error) => {
        //     console.log("getDataBranch error", error);
        // }
        // );
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
                            onClick={() => navigate(`/machine_list`, { state: { key: branch.id, name: branch.name } })}
                            suffix={<Icon icon="zi-arrow-right" />}
                        >
                            <div>{branch.name}</div>
                        </List.Item>
                    ))}

                </List>
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

export default MachinePage;
