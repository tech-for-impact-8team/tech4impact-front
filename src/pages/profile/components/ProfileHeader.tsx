import styled from '@emotion/styled';

const ProfileHeader = () => {
  return (
    <ProfileWrapper>
      <ProfileLogo />
    </ProfileWrapper>
  );
};

export default ProfileHeader;

const ProfileWrapper = styled.header`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const ProfileLogo = styled.img`
  /* css 작성 */
`;
