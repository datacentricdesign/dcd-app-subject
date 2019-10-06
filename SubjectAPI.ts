import {API} from "@datacentricdesign/dcd-sdk-js";

export class PersonAPI extends API {

    protected init() {
        super.init();

        // These routes use the Universal engine
        this.router.get(options.baseUrl + '/', this.checkAuthentication,
            async (req, res, next) => {
                res.render('index', {req});
            });
        // page because the redirection of '/*' crash beacuase there are many other redirection
        this.router.get(options.baseUrl + '/page/*', this.checkAuthentication,
            async (req, res, next) => {
                res.render('index', {req});
            });

        // Recup mapsKey
        this.router.get(options.baseUrl + '/mapsKey', this.checkAuthentication
            , (req, res) => {
                res.send(
                    {key: google_maps_key}
                );
            });

    }

}
