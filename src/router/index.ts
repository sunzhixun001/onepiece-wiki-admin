import TimelineListScreen from '@pages/timeline/list';
import CharacterListScreen from '@pages/character/list';
import HomeScreen from '@pages/home';
import { RouteConfig } from 'react-router-config';

const routers: RouteConfig[] = [
    {
        component: HomeScreen,
        routes: [
            {
                path: '/timeline',
                component: TimelineListScreen,
                exact: true
            }, {
                path: '/character',
                component: CharacterListScreen
            }
        ]
    }
];

export default routers;
