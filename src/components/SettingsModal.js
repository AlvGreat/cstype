import React, { useState } from "react";
import styles from '../styles/SettingsModal.module.css';

const SettingsModal = ({ testLanguage, setTestLanguage }) => {
    const [modal, setModal] = useState(false);

    // returns an array of divs with a button for each programming language
    const generateSettingDivs = () => {
        // maps the display on the UI to language extension setter
        const settings = {
            "java": () => setTestLanguage("java"),
            "cpp": () => setTestLanguage("cpp")
        }

        let arr = [];
        for (const s in settings) {
            if(testLanguage === s) arr.push(<div onClick={settings[s]} className={`${styles.btn} ${styles.activeBtn}`}>{s}</div>);
            else arr.push(<div onClick={settings[s]} className={styles.btn}>{s}</div>);
        }
        return arr;
    }

    const toggleModal = () => {
        setModal(!modal);
    };

    return (
    <>
        <span onClick={toggleModal} className={styles.btn}>
            <i className={`fas fa-tools`}></i>
            <span> | language: {testLanguage}</span>
        </span>

        {modal && (
        <div className={styles.modal}>
            <div onClick={toggleModal} className={styles.overlay}></div>
            <div className={styles.modalContent}>
                <button className={styles.closeModal} onClick={toggleModal}>CLOSE</button>
                <h2>Typing Test Language:</h2>
                <div className={styles.settingContainer}>
                    {generateSettingDivs()}
                </div>
            </div>
        </div>
        )}
    </>
    );
}

export default SettingsModal;