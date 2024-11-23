import SideBar from '../components/side-bar'
import { Outlet } from 'react-router-dom'
import styles from './main.module.scss'
export default function Index() {
  return (
    <div className={styles.container}>
      <SideBar />
      <div className={styles.outlet}>
        <Outlet />
      </div>
    </div>
  )
}