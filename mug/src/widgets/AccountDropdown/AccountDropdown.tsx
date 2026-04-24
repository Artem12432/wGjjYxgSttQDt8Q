
import { Link } from "react-router-dom";
import { api } from "../../app/api/api.ts";
import styles from "./AccountDropdown.module.css";
import { useEffect, useRef, useState} from "react";

export const AccountDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const clickGraber = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (clickGraber.current && !clickGraber.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [clickGraber]);


  function handleLogout() {
    api.auth.logout();
    window.location.href = "/";
  }


  return (
    <div ref={clickGraber} className={styles.Account}>
      <button className={styles.NavAccBTN} onClick={() => setIsOpen(!isOpen)}>Account</button>
        {isOpen && (
            <div className={styles.AccountDropdown}>
                <Link className={styles.AccountDropdownItem} to="/profile" onClick={handleLogout}>
                    Profile
                </Link>
                <Link className={styles.AccountDropdownItem} to="/settings" onClick={handleLogout}>
                    Settings
                </Link>
                <Link className={styles.AccountDropdownItem} to="/title" onClick={handleLogout}>
                    Title
                </Link>
                <button className={styles.AccountDropdownItem} onClick={handleLogout}>
                    Logout
                </button>
            </div>
        )}
    </div>
  );    
};
