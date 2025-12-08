import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useState } from 'react';
import LogoImg from '@shared/assets/logo.svg';
import ProfileImg from '@shared/assets/logo.svg';
import { useLogout } from '@app/api/hooks/authHooks';

const STATUS_HEIGHT = 60;
const ACTIVE_COLOR = '#B0E618';

const Wrapper = styled.header`
  width: 100%;
  height: ${STATUS_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: center; /* 메뉴 가운데 */
  border-bottom: 1px solid #eee;
  background-color: #fff;
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1440px; /* 페이지 전체 가운데 정렬 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  width: 90px;
  height: 30px;
  object-fit: contain;
`;

const Nav = styled.nav`
  display: flex;
  gap: 40px;
  align-items: center;
`;

const MenuItem = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>`
  font-size: 18px;
  font-weight: ${({ active }) => (active ? 700 : 400)};
  position: relative;
  color: ${({ active }) => (active ? '#000' : '#555')};
  line-height: 60px;
  text-decoration: none;

  &:after {
    content: '';
    display: ${({ active }) => (active ? 'block' : 'none')};
    position: absolute;
    bottom: 15px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${ACTIVE_COLOR};
  }
`;

const Right = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;

export const StatusBar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setOpen(false);
        navigate('/login');
      },
    });
  };

  return (
    <Wrapper>
      <Inner>
        {/* 좌측 로고 */}
        <Left>
          <Logo src={LogoImg} alt='logo' />
        </Left>

        {/* 가운데 메뉴 */}
        <Nav>
          <MenuItem to='/' active={pathname === '/'}>
            홈
          </MenuItem>

          <MenuItem to='/dashboard' active={pathname.includes('dashboard')}>
            경사로 데이터
          </MenuItem>

          <MenuItem to='/statistics' active={pathname.includes('statistics')}>
            대시보드
          </MenuItem>

          <MenuItem to='/upload' active={pathname.includes('upload')}>
            데이터 등록
          </MenuItem>
        </Nav>

        {/* 우측 마이페이지 */}
        <Right onClick={() => setOpen(!open)}>
          <img
            src={ProfileImg}
            alt='mypage'
            style={{ width: 36, height: 36, borderRadius: '50%', background: '#f5f5f5' }}
          />
          <span style={{ fontSize: 20 }}>▼</span>
          {open && (
            <DropDown>
              <ProfileImage src={ProfileImg} alt='profile' />
              <Name>홍길동</Name>
              <MenuLinkButton to='/my'>마이페이지</MenuLinkButton>
              <MenuItemButton onClick={handleLogout} disabled={logoutMutation.status === 'pending'}>
                {logoutMutation.status === 'pending' ? '로딩...' : '로그아웃'}
              </MenuItemButton>
            </DropDown>
          )}
        </Right>
      </Inner>
    </Wrapper>
  );
};
const DropDown = styled.div`
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;

  @media (max-width: 1000px) {
    left: auto;
    right: 0;
    transform: none;
  }
`;

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  align-self: center;
  margin-bottom: 12px;
`;

const Name = styled.div`
  text-align: center;
  font-weight: 600;
  margin-bottom: 16px;
`;

const MenuItemButton = styled.button`
  padding: 10px 0;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #333;

  &:hover {
    color: #b0e618;
  }
`;

const MenuLinkButton = styled(Link)`
  padding: 10px 0;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  text-decoration: none;
  &:hover {
    color: #b0e618;
  }
`;
