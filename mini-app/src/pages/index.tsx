import React, { Suspense, useEffect, useState } from "react";
import { List, Page, Icon, useNavigate,Text } from "zmp-ui";
import UserCard from "components/user-card";
import { authorize, getUserInfo } from "zmp-sdk/apis";


const HomePage: React.FunctionComponent = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [userError, setUserError] = useState('');

    const getUser = async () => {
        try {
            const { userInfo } = await getUserInfo({});
            setUser(userInfo);
            console.log("🚀 ~ getUser ~ userInfo:", userInfo)
        } catch (error: any) {
            if (error && error.message) {
                setUserError(error.message);
            }
            console.log('getUser error', error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);


    return (
        <Page className="page">
            <Suspense>
                <div className="section-container">
                    {
                        userError ? 
                        (<Text>{userError}</Text>) :
                        (<UserCard />)
                    }
                </div>
            </Suspense>
            <div className="section-container">
                <List>
                    <List.Item
                        onClick={() => navigate("/about")}
                        suffix={<Icon icon="zi-arrow-right" />}
                    >
                        <div>About</div>
                    </List.Item>
                </List>
            </div>
        </Page>
    );
};

export default HomePage;
