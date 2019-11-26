define([
   'esri/units',
   'esri/geometry/Extent',
   'esri/config',
   'esri/tasks/GeometryService',
   'esri/layers/ImageParameters',
   'esri/tasks/query'//,
   //'esri/urlUtils'
], function (units, Extent, esriConfig, GeometryService, ImageParameters, Query, urlUtils) {

    // url to your proxy page, must be on same machine hosting your app. See proxy folder for readme.
    esriConfig.defaults.io.proxyUrl = 'proxy/proxy.ashx';
    esriConfig.defaults.io.alwaysUseProxy = true;

    //urlUtils.addProxyRule({
    //    urlPrefix: "https://mapservice.nmstatelands.org:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer",
    //    proxyUrl: "https://localhost:6644/proxy/proxy.ashx"
    //});

    // url to your geometry server.
    esriConfig.defaults.geometryService = new GeometryService('https://mapservice.nmstatelands.org/arcgis/rest/services/Utilities/Geometry/GeometryServer');

    //image parameters for dynamic services, set to png32 for higher quality exports.
    var imageParameters = new ImageParameters();
    imageParameters.format = 'png32';

    return {
        // used for debugging your app
        isDebug: true,

        //default mapClick mode, mapClickMode lets widgets know what mode the map is in to avoid multipult map click actions from taking place (ie identify while drawing).
        defaultMapClickMode: 'identify',
        // map options, passed to map constructor. see: https://developers.arcgis.com/javascript/jsapi/map-amd.html#map1
        mapOptions: {
            // may not need
            navigationMode: 'classic',
            logo: false,
            basemap: 'topo',
//            basemap: 'gray',
            center: [-106, 34],
            zoom:7,
            sliderStyle: 'small'
        },
        panes: {
         	left: {
         	    splitter: true
                //open: 'none'
         	},
        // 	right: {
        // 		id: 'sidebarRight',
        // 		placeAt: 'outer',
        // 		region: 'right',
        // 		splitter: true,
        // 		collapsible: true
        // 	},
         	bottom: {
         		id: 'sidebarBottom',
         		placeAt: 'outer',
                open: 'none',
         		splitter: true,
         		collapsible: true,
         		region: 'bottom',
         		style: 'height:250px;',
         		content: '<div id="attributesContainer"></div>'
         	}//,
        // 	top: {
        // 		id: 'sidebarTop',
        // 		placeAt: 'outer',
        // 		collapsible: true,
        // 		splitter: true,
        // 		region: 'top'
        // 	}
        },
        // collapseButtonsPane: 'center', //center or outer

        // operationalLayers: Array of Layers to load on top of the basemap: valid 'type' options: 'dynamic', 'tiled', 'feature'.
        // The 'options' object is passed as the layers options for constructor. Title will be used in the legend only. id's must be unique and have no spaces.
        // 3 'mode' options: MODE_SNAPSHOT = 0, MODE_ONDEMAND = 1, MODE_SELECTION = 2
        operationalLayers: [
            {
                type: 'dynamic',
                url: 'https://mapservice.nmstatelands.org/arcgis/rest/services/Public/Location_t/MapServer',
                title: 'Locations',
                options: {
                    id: 'layerLocations',
                    opacity: 1.0,
                    visible: false,
                    outFields: ['*'],
                    mode: 0
                },
                editorLayerInfos: {
                    disableGeometryUpdate: false
                },
                legendLayerInfos: {
                    exclude: false,
                    layerInfo: {
                        title: 'Locations'
                    }
                },
                identifyLayerInfos: {
                    layerIds: [1,2,3,4,5,6,7,11,12,14,15,16,17]
                }
            },
            {
                type: 'dynamic',
                url: 'https://mapservice.nmstatelands.org/arcgis/rest/services/Public/Transportation_t/MapServer',
                title: 'Transportation',
                options: {
                    id: 'layerTransportation',
                    opacity: 1.0,
                    visible: false,
                    outFields: ['*'],
                    mode: 0
                },
                editorLayerInfos: {
                    disableGeometryUpdate: false
                },
                legendLayerInfos: {
                    exclude: false,
                    layerInfo: {
                        title: 'Transportation'
                    }
                }
            },
            {
                type: 'dynamic',
                url: 'https://mapservice.nmstatelands.org/arcgis/rest/services/Public/SLO_Active_Leases_t/MapServer',
                title: 'Leases',
                options: {
                    id: 'layerLeases',
                    opacity: 1.0,
                    visible: true,
                    outFields: ['*'],
                    mode: 0
                },
                editorLayerInfos: {
                    disableGeometryUpdate: false
                },
                legendLayerInfos: {
                    exclude: false,
                    layerInfo: {
                        title: 'Leases'
                    }
                }
            },
            {
                type: 'dynamic',
                url: 'https://mapservice.nmstatelands.org/arcgis/rest/services/Public/LandStatus_t/MapServer',
                title: 'Land Status',
                options: {
                    id: 'layerLandStatus',
                    opacity: 0.6,// 1.0,
                    visible: true,
                    outFields: ['*'],
                    mode: 0
                },
                editorLayerInfos: {
                    disableGeometryUpdate: false
                },
                legendLayerInfos: {
                    exclude: false,
                    layerInfo: {
                        title: 'Land Status'
                    }
                }
            }
        ],
        

        // set include:true to load. For titlePane type set position the the desired order in the sidebar
        widgets: {
            growler: {
                include: true,
                id: 'growler',
                type: 'domNode',
                path: 'gis/dijit/Growler',
                srcNodeRef: 'growlerDijit',
                options: {}
            },
            exportDialog: {
                include: true,
                id: 'export',
                type: 'floating',
                path: 'gis/dijit/Export',
                title: 'Export',
                options: {}
            },
            // attributesTable: {
                // include: true,
                // id: 'attributesContainer',
                // type: 'domNode',
                // srcNodeRef: 'attributesContainer',
                // path: 'gis/dijit/AttributesTable',
                // options: {
                    // map: true,
                    // mapClickMode: true,
                    //use a tab container for multiple tables or
                    //show only a single table
                    // useTabs: true,
                    //used to open the sidebar after a query has completed
                    // sidebarID: 'sidebarBottom',
                    // tables: [
                        // {
                           // id: 'agriculturalLeasesTable',
                           // title: 'Agricultural Leases',
                           // topicID: 'agriculturalLeasesQuery',
                           // closable: false,
                           // featureOptions: {
                              // highlighted: false,
                              // selected: false,
                              // features: false
                           // },
                           // queryOptions: {
                               // queryParameters: {
                                   // id: 'agriculturalLeasesQueryId',
                                   // addToExisting: false,
                                   // url: 'http://mapservice.nmstatelands.org:6080/arcgis/rest/services/Public/SLO_Active_Leases_t/MapServer/3',
                                   // maxAllowableOffset: 100,
                                   // outFields: ['OBJECTID', 'UNIQUEKEY', 'OGRID_NAM', 'LSE_ACRG', 'ATYP_CDES'],
                                   // where: '1=0'
                               // }
                           // }
                        // }
                        // ,
                        // {
                           // id: 'landsWithdrawnFromHuntingTable',
                           // title: 'Lands Withdrawn From Hunting',
                           // topicID: 'landsWithdrawnFromHuntingQuery',
                           // closable: false,
                           // featureOptions: {
                              //highlighted: false//,
                              // selected: true//,
                              //features: false
                           // },
                           // queryOptions: {
                               // queryParameters: {
                                   // id: 'landsWithdrawnFromHuntingQueryId',
                                   // addToExisting: false,
                                   // url: 'http://mapservice.nmstatelands.org:6080/arcgis/rest/services/Public/Hunting_t/MapServer/4',
                                   // maxAllowableOffset: 100,
                                   // outFields: ['OBJECTID', 'UNIQUEKEY', 'OGRID_NAM', 'ACRG', 'REASON'],
                                   // where: '1=0'
                               // }
                           // }
                        // }
                    // ]
                // }
            // },
            geocoder: {
                include: true,
                id: 'geocoder',
                type: 'domNode',
                path: 'gis/dijit/Geocoder',
                srcNodeRef: 'geocodeDijit',
                options: {
                    map: true,
                    mapRightClickMenu: true,
                    geocoderOptions: {
                        autoComplete: true,
                        arcgisGeocoder: {
                            placeholder: 'Enter an address or place'
                        }
                    }
                }
            },
            identify: {
                include: true,
                id: 'identify',
                type: 'titlePane',
                path: 'gis/dijit/Identify',
                title: 'Identify',
                open: false,
                position: 3,
                options: 'config/identify'
            },
            basemaps: {
                include: true,
                id: 'basemaps',
                type: 'domNode',
                path: 'gis/dijit/Basemaps',
                srcNodeRef: 'basemapsDijit',
                options: 'config/basemaps'
            },
            mapInfo: {
                include: false,
                id: 'mapInfo',
                type: 'domNode',
                path: 'gis/dijit/MapInfo',
                srcNodeRef: 'mapInfoDijit',
                options: {
                    map: true,
                    mode: 'dms',
                    firstCoord: 'y',
                    unitScale: 3,
                    showScale: true,
                    xLabel: '',
                    yLabel: '',
                    minWidth: 286
                }
            },
            scalebar: {
                include: true,
                id: 'scalebar',
                type: 'map',
                path: 'esri/dijit/Scalebar',
                options: {
                    map: true,
                    attachTo: 'bottom-left',
                    scalebarStyle: 'line',
                    scalebarUnit: 'dual'
                }
            },
            locateButton: {
                include: true,
                id: 'locateButton',
                type: 'domNode',
                path: 'gis/dijit/LocateButton',
                srcNodeRef: 'locateButton',
                options: {
                    map: true,
                    publishGPSPosition: true,
                    highlightLocation: true,
                    useTracking: true,
                    geolocationOptions: {
                        maximumAge: 0,
                        timeout: 15000,
                        enableHighAccuracy: true
                    }
                }
            },
            overviewMap: {
                include: true,
                id: 'overviewMap',
                type: 'map',
                path: 'esri/dijit/OverviewMap',
                options: {
                    map: true,
                    attachTo: 'bottom-right',
                    color: '#0000CC',
                    height: 175,
                    width: 200,
                    opacity: 0.3,
                    visible: false
                }
            },
            homeButton: {
                include: true,
                id: 'homeButton',
                type: 'domNode',
                path: 'esri/dijit/HomeButton',
                srcNodeRef: 'homeButton',
                options: {
                    map: true,
                    extent: new Extent({
                        xmin: -110, // left
                        ymin: 31.2, // bottom
                        xmax: -102, // right
                        ymax: 37.2, // top
                        spatialReference: {
                            wkid: 4326
                        }
                    })
                }
            },
            legend: {
                include: true,
                id: 'legend',
                type: 'titlePane',
                path: 'esri/dijit/Legend',
                title: 'Legend',
                open: false,
                position: 1,
                options: {
                    map: true,
                    legendLayerInfos: true
                }
            },
            zoomToFeature: {
               include: false,
               id: 'zoomToGMULayer',
               type: 'titlePane',
               path: 'gis/dijit/ZoomToFeature',
               title: 'Select a GMU',
               open: true,
               position: 0,
               options: {
                   map: true,
                   // you can customize the button text
                   i18n: {
                       selectFeature: 'Select'
                   },
                   url: 'https://mapservice.nmstatelands.org:6080/arcgis/rest/services/Public/Hunting_t/MapServer/3',
                   field: 'GMU'
                   ,
                   where: 'STATE_FIPS = \'06\''
               }
            },
            layerControl: {
                include: true,
                id: 'layerControl',
                type: 'titlePane',
                path: 'gis/dijit/LayerControl',
                title: 'Layers',
                open: true,
                position: 0,
                options: {
                    map: true,
                    layerControlLayerInfos: true,
                    separated: true,
                    vectorReorder: true,
                    overlayReorder: true
                }
            },
            bookmarks: {
                include: true,
                id: 'bookmarks',
                type: 'titlePane',
                path: 'gis/dijit/Bookmarks',
                title: 'Bookmarks',
                open: false,
                position: 4,
                options: 'config/bookmarks'
            },
            find: {
                include: true,
                id: 'find',
                type: 'titlePane',
                canFloat: false,
                path: 'gis/dijit/Find',
                title: 'Search',
                open: false,
                position: 2,
                options: 'config/find'
            },
            draw: {
                include: true,
                id: 'draw',
                type: 'titlePane',
                canFloat: false,
                path: 'gis/dijit/Draw',
                title: 'Draw',
                open: false,
                position: 5,
                options: {
                    map: true,
                    mapClickMode: true
                }
            },
            measure: {
                include: true,
                id: 'measurement',
                type: 'titlePane',
                canFloat: false,
                path: 'gis/dijit/Measurement',
                title: 'Measurement',
                open: false,
                position: 6,
                options: {
                    map: true,
                    mapClickMode: true,
                    defaultAreaUnit: units.SQUARE_MILES,
                    defaultLengthUnit: units.MILES
                }
            },
            print: {
                include: true,
                id: 'print',
                type: 'titlePane',
                canFloat: false,
                path: 'gis/dijit/Print',
                title: 'Print',
                open: false,
                position: 7,
                options: {
                    map: true,
                    //printTaskURL: 'https://mapservice.nmstatelands.org:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
                    printTaskURL: 'https://mapservice.nmstatelands.org/arcgis/rest/services/PrintTemplates/PublicPrints/GPServer/Export%20Web%20Map',
                    copyrightText: 'State of New Mexico',
                    authorText: 'State Land Office',
                    defaultTitle: 'Land Status',
                    defaultFormat: 'PDF',
                    defaultLayout: 'Letter - Portrait'
                    
                }
            },
            directions: {
                include: false,
                id: 'directions',
                type: 'titlePane',
                path: 'gis/dijit/Directions',
                title: 'Directions',
                open: false,
                position: 8,
                options: {
                    map: true,
                    mapRightClickMenu: true,
                    options: {
                        routeTaskUrl: 'https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Network/USA/NAServer/Route',
                        routeParams: {
                            directionsLanguage: 'en-US',
                            directionsLengthUnits: units.MILES
                        },
                        active: false //for 3.12, starts active by default, which we dont want as it interfears with mapClickMode
                    }
                }
            },
            editor: {
                include: false,
                id: 'editor',
                type: 'titlePane',
                path: 'gis/dijit/Editor',
                title: 'Editor',
                open: false,
                position: 9,
                options: {
                    map: true,
                    mapClickMode: true,
                    editorLayerInfos: true,
                    settings: {
                        toolbarVisible: true,
                        showAttributesOnClick: true,
                        enableUndoRedo: true,
                        createOptions: {
                            polygonDrawTools: ['freehandpolygon', 'autocomplete']
                        },
                        toolbarOptions: {
                            reshapeVisible: true,
                            cutVisible: true,
                            mergeVisible: true
                        }
                    }
                }
            },
            streetview: {
                include: false,
                id: 'streetview',
                type: 'titlePane',
                canFloat: true,
                position: 10,
                path: 'gis/dijit/StreetView',
                title: 'Google Street View',
                options: {
                    map: true,
                    mapClickMode: true,
                    mapRightClickMenu: true
                }
            },
            help: {
                include: true,
                id: 'help',
                type: 'floating',
                path: 'gis/dijit/Help',
                title: 'Help',
                options: {}
            }

        }
    };

});
