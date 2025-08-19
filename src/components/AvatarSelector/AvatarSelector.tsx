import styles from './AvatarSelector.module.css';

type AvatarSelectorType = {
    avatarImage: string | null;
    onSelect: (type: 'image', value: string | null) => void;
}

const AvatarSelector = ({ avatarImage, onSelect } : AvatarSelectorType) => {
    const profileImage = [
        'boy1.jpg', 'boy2.jpg', 'boy3.jpg', 'boy4.jpg', 'boy5.jpg', 'boy6.jpg',
        'girl1.jpg', 'girl2.jpg', 'girl3.jpg', 'girl4.jpg', 'girl5.jpg', 'girl6.jpg',
    ]

    return (
        <div className={styles.avatarSelector}>
            <h4 className={styles.title}>Set Profile Image</h4>
            <div className={styles.avatarGrid}>
                {profileImage.map(img => (
                    <div
                        key={img}
                        className={`${styles.avatarItem} ${avatarImage === img ? styles.selected : ''}`}
                        onClick={() => onSelect('image', img)}
                    >
                        <img
                            src={`/img/profile/${img}`}
                            alt={img}
                            className={styles.avatarImage}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AvatarSelector;