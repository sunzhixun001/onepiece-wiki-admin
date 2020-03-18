import WikiListScreen from '../pages/wiki/list'
import TimelineListScreen from '@pages/timeline/list';
import CharacterListScreen from '@pages/character/list';
import HomeScreen from '@pages/home';
import { RouteConfig } from 'react-router-config';

const routers: RouteConfig[] = [
    {
        component: HomeScreen,
        routes: [
            {
                path: "/wiki",
                component: WikiListScreen,
                exact: true
                // routes: [
                //     {
                //         path: '/wiki/detail/:id',
                //         component: WikiDetailScreen
                //     }
                // ]
            }, {
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
