import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Skeleton from '@mui/material/Skeleton';
import { Fragment } from 'react';

const Postskeleton = () => {
    return (
        <>
        <Card sx={{ width: 444, m: 2, height: 650}}>
          <CardHeader
            avatar={<Skeleton animation="wave" variant="circular" width={35} height={35} />}
            action={(<IconButton aria-label="settings"><MoreVertIcon /></IconButton>)}
            title={(
              <Skeleton
                animation="wave"
                height={35}
                width="30%"
              />
            )}
            />
            <Skeleton sx={{ height: 500 }} animation="wave" variant="rectangular" />
        </Card>
        </>
    )
}

export default Postskeleton;