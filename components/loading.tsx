// app/loading.tsx
import React from 'react';
import styles from './loading.module.css';

export default function Loading() {
    return (
        <div className={styles.loaderWrapper}>
            <div className={styles.loaderCore}>
                <div className={`${styles.orbitalRing} ${styles.ringOne}`}></div>
                <div className={`${styles.orbitalRing} ${styles.ringTwo}`}></div>
                <div className={`${styles.orbitalRing} ${styles.ringThree}`}></div>
            </div>

            <div className={styles.loaderTextContainer}>
                <h2 className={styles.loaderText}>Establishing Neural Link</h2>
                <div className={styles.loadingDots}>
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                </div>
            </div>
        </div>
    );
}