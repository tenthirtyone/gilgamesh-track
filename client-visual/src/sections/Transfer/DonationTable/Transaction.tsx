import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      marginLeft: '244px'
    }
}))

export const Transaction = () => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <h1>Transactions</h1>
        </div>
    )
}