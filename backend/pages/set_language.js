import React from 'react'
import BasePage from '../src/components/BasePage'
import SetLanguage from '../src/components/Language/SetLanguage'
import TabLanguage from '../src/components/Language/TabLanguage'

const SetLanguagePage = () => {
    return (
        <BasePage>
            <SetLanguage />
            <TabLanguage />
        </BasePage>
    )
}

export default SetLanguagePage