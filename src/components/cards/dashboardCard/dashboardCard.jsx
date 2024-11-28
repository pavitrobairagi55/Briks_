import styles from "./dashboardCard.module.scss";
import {Box} from "@mui/material";
export default function DashboardCard({ icon, title, value }) {
  return (
    <Box className={styles.container} sx={{minWidth:'170px'}}>
      <h3 className={styles.header}>{title}</h3>
      <div className={styles.body}>
        <div>{value}</div>
        {icon && icon}
      </div>
    </Box>
  );
}
