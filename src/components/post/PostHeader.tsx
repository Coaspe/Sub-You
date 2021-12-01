import {useState} from "react"
import Avatar from '@mui/material/Avatar';
import { photoContent } from '../../types';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const PostHeader = ({content}: photoContent) => {
    const options = [
        'Save',
        'Purchase',
      'Auction',
        "Report"
    ];
    const ITEM_HEIGHT = 48;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className="flex item-center justify-between bg-white px-2 py-2 border-t-2 border-l-2 border-r-2 font-stix ">
            <div className="flex items-center justify-center">
                <Avatar className="mr-2" alt="user avatar" src="/images/1.jpg" />
                <span>{content.username}</span>
            </div>
            <div>
              <IconButton
              aria-label="more"
              id="long-button"
              aria-controls="long-menu"
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
          <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: '20ch',
                },
                }}
              >
              {options.map((option) => (
                <MenuItem key={option} selected={option === 'Save'} onClick={handleClose}>
                  {option}
                </MenuItem>
              ))}
              </Menu>
            </div>
        </div>
    )
}

export default PostHeader;