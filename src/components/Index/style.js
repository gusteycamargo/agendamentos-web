import styled from 'styled-components';

export const Menu = styled.div`
    width: 100%;
    background-color: ${props => props.theme.colors.primary};
    height: 35px;
    display: flex;
`;

export const Header = styled.div`
    width: 100%;
    margin-top: 5px;
    margin-bottom: 5px;
    align-items: center;
    display: flex;
    justify-content: center;
    background-color: ${props => props.theme.colors.primary};
`;

export const ContainerIndex = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 90%;
`;

export const Container = styled(ContainerIndex)`
    background-color: ${props => props.theme.colors.primary};
    margin-left: 5%;
`;

export const InfoUser = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const Image = styled.img`
    width: 80px;
    height: 100%;
`;

export const UserFullname = styled.p`
    font-size: 16px;
	font-weight: bold;
	color: #000;
	margin-bottom: 0;
`;

export const CampusName = styled.p`
    margin-bottom: 0;
`;

export const Button = styled.button`
    display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 10px;
	margin-bottom: 5px;
    color: #fff;
    font-size: 16px;
    background: #042963;
    height: 30px;
    padding: 0 20px;
    border: 0;
    border-radius: 5px;
    width: 70%;

    &:hover, &:focus {
        cursor: pointer;
	    background-color: rgba(4, 41, 99, 0.66);
    }
`;

export const Dropbutton = styled.div`
    color: white;
    font-size: 16px;
    border: none;
    cursor: pointer;
    font-size: 15px;
    margin-left: 5px;
    margin-right: 15px;
    color: #FFF;

    &:hover {
        color: #CCC;
    }
`;

