import ProfileHeader from '@pages/profile/components/ProfileHeader.tsx';
import styled from '@emotion/styled';

const ProfilePage = () => {
  return (
    <ProfileContainer>
      <div style={{}}></div>
      <ProfileHeader />
    </ProfileContainer>
  );
};

export default ProfilePage;

const ProfileContainer = styled.section`
  display: flex;
  flex-direction: column;
`;
