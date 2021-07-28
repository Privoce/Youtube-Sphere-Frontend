import {useState} from "react";
import ProfileDialog from "./ProfileDialog";
import AuthingFloater from "./AuthingFloater";

export default function ProfileIndex( {serverSync} ) {
    const [profileExist, setProfileExist] = useState(false);
    const toggleProfileDialog = () => {
        setProfileExist((prev) => !prev);
    }
    return (
        <div id="authing-floater">
            <AuthingFloater serverSync={serverSync} openDialog={toggleProfileDialog} />
            { profileExist ? <ProfileDialog closeDialog={toggleProfileDialog} /> : null }
        </div>
    )
}