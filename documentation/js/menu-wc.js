'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">apm documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-7ebcc5db87b4e4fecf1f7d261ca0cc02277bab9f97646b6e2640c6927b2f3e49a53ef996a10604718e590fdbf861d8221aceb1a2f0727924aadc01d53c505bc4"' : 'data-target="#xs-components-links-module-AppModule-7ebcc5db87b4e4fecf1f7d261ca0cc02277bab9f97646b6e2640c6927b2f3e49a53ef996a10604718e590fdbf861d8221aceb1a2f0727924aadc01d53c505bc4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-7ebcc5db87b4e4fecf1f7d261ca0cc02277bab9f97646b6e2640c6927b2f3e49a53ef996a10604718e590fdbf861d8221aceb1a2f0727924aadc01d53c505bc4"' :
                                            'id="xs-components-links-module-AppModule-7ebcc5db87b4e4fecf1f7d261ca0cc02277bab9f97646b6e2640c6927b2f3e49a53ef996a10604718e590fdbf861d8221aceb1a2f0727924aadc01d53c505bc4"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PageNotFoundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PageNotFoundComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRootingModule.html" data-type="entity-link" >AppRootingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/eshopApiModule.html" data-type="entity-link" >eshopApiModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-eshopApiModule-81c48f6109b9aa6e4f978b8f7cfcdf3181c8832288e8429b65c9a9866c5c43e125d1cc12125d743a2780bc72169ebd017fa463694c8080d879d91aca3f8a46b7"' : 'data-target="#xs-injectables-links-module-eshopApiModule-81c48f6109b9aa6e4f978b8f7cfcdf3181c8832288e8429b65c9a9866c5c43e125d1cc12125d743a2780bc72169ebd017fa463694c8080d879d91aca3f8a46b7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-eshopApiModule-81c48f6109b9aa6e4f978b8f7cfcdf3181c8832288e8429b65c9a9866c5c43e125d1cc12125d743a2780bc72169ebd017fa463694c8080d879d91aca3f8a46b7"' :
                                        'id="xs-injectables-links-module-eshopApiModule-81c48f6109b9aa6e4f978b8f7cfcdf3181c8832288e8429b65c9a9866c5c43e125d1cc12125d743a2780bc72169ebd017fa463694c8080d879d91aca3f8a46b7"' }>
                                        <li class="link">
                                            <a href="injectables/AuthenticationAPI.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthenticationAPI</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/Http2Eshop.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Http2Eshop</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoginModule.html" data-type="entity-link" >LoginModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LoginModule-51c6c231b792d4491e5ac6e98da574f1f1a0413a3654631f85c1a475ea4f77a66e75f37f0e7f0d16b9776b517c49ef0b0b6791a090537d5cbe46885a7bc562fc"' : 'data-target="#xs-components-links-module-LoginModule-51c6c231b792d4491e5ac6e98da574f1f1a0413a3654631f85c1a475ea4f77a66e75f37f0e7f0d16b9776b517c49ef0b0b6791a090537d5cbe46885a7bc562fc"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LoginModule-51c6c231b792d4491e5ac6e98da574f1f1a0413a3654631f85c1a475ea4f77a66e75f37f0e7f0d16b9776b517c49ef0b0b6791a090537d5cbe46885a7bc562fc"' :
                                            'id="xs-components-links-module-LoginModule-51c6c231b792d4491e5ac6e98da574f1f1a0413a3654631f85c1a475ea4f77a66e75f37f0e7f0d16b9776b517c49ef0b0b6791a090537d5cbe46885a7bc562fc"' }>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoginPageRoutingModule.html" data-type="entity-link" >LoginPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ProductDetailModule.html" data-type="entity-link" >ProductDetailModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ProductDetailModule-ee2f72d228b5f371610dc137e569d5b85a31fe8f0a60f940ee4cb1fefac2153987b7d163ac3fb0f0ade05d2c64f5f57f25cca838172da90adaba6e20bc6a6760"' : 'data-target="#xs-components-links-module-ProductDetailModule-ee2f72d228b5f371610dc137e569d5b85a31fe8f0a60f940ee4cb1fefac2153987b7d163ac3fb0f0ade05d2c64f5f57f25cca838172da90adaba6e20bc6a6760"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProductDetailModule-ee2f72d228b5f371610dc137e569d5b85a31fe8f0a60f940ee4cb1fefac2153987b7d163ac3fb0f0ade05d2c64f5f57f25cca838172da90adaba6e20bc6a6760"' :
                                            'id="xs-components-links-module-ProductDetailModule-ee2f72d228b5f371610dc137e569d5b85a31fe8f0a60f940ee4cb1fefac2153987b7d163ac3fb0f0ade05d2c64f5f57f25cca838172da90adaba6e20bc6a6760"' }>
                                            <li class="link">
                                                <a href="components/ProductDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductDetailComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProductDetailPageRoutingModule.html" data-type="entity-link" >ProductDetailPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ProductEditModule.html" data-type="entity-link" >ProductEditModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ProductEditModule-88b7e88386549d7559731c1d11e2eede54ba5afe7f0ed3c8f13be16299bf8b20e47ca258ffdc9c20ca707b80671d13cfc570532eb6498013aa8c6cde46bd160a"' : 'data-target="#xs-components-links-module-ProductEditModule-88b7e88386549d7559731c1d11e2eede54ba5afe7f0ed3c8f13be16299bf8b20e47ca258ffdc9c20ca707b80671d13cfc570532eb6498013aa8c6cde46bd160a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProductEditModule-88b7e88386549d7559731c1d11e2eede54ba5afe7f0ed3c8f13be16299bf8b20e47ca258ffdc9c20ca707b80671d13cfc570532eb6498013aa8c6cde46bd160a"' :
                                            'id="xs-components-links-module-ProductEditModule-88b7e88386549d7559731c1d11e2eede54ba5afe7f0ed3c8f13be16299bf8b20e47ca258ffdc9c20ca707b80671d13cfc570532eb6498013aa8c6cde46bd160a"' }>
                                            <li class="link">
                                                <a href="components/ProductEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductEditComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProductEditPageRoutingModule.html" data-type="entity-link" >ProductEditPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ProductNewModule.html" data-type="entity-link" >ProductNewModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ProductNewModule-3332e469cd797de40af0a06225407e1b716b936e0313deed6c21ee5bdf5c3dfa5b15ce6286d244742e4805f2bb6a35889e962fbffd166fdd5a7f9d8a20ff9e88"' : 'data-target="#xs-components-links-module-ProductNewModule-3332e469cd797de40af0a06225407e1b716b936e0313deed6c21ee5bdf5c3dfa5b15ce6286d244742e4805f2bb6a35889e962fbffd166fdd5a7f9d8a20ff9e88"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProductNewModule-3332e469cd797de40af0a06225407e1b716b936e0313deed6c21ee5bdf5c3dfa5b15ce6286d244742e4805f2bb6a35889e962fbffd166fdd5a7f9d8a20ff9e88"' :
                                            'id="xs-components-links-module-ProductNewModule-3332e469cd797de40af0a06225407e1b716b936e0313deed6c21ee5bdf5c3dfa5b15ce6286d244742e4805f2bb6a35889e962fbffd166fdd5a7f9d8a20ff9e88"' }>
                                            <li class="link">
                                                <a href="components/ProductNewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductNewComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProductNewPageRoutingModule.html" data-type="entity-link" >ProductNewPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ProductsModule.html" data-type="entity-link" >ProductsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ProductsModule-f0d7eb5eb95f0dc62eee09a45c9ff55dde78c4ff909e07562817471406cb07f95313f9208cd87a482876ccec0648df38f7efe880233ed3b4c3a8d00b457f9c35"' : 'data-target="#xs-components-links-module-ProductsModule-f0d7eb5eb95f0dc62eee09a45c9ff55dde78c4ff909e07562817471406cb07f95313f9208cd87a482876ccec0648df38f7efe880233ed3b4c3a8d00b457f9c35"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProductsModule-f0d7eb5eb95f0dc62eee09a45c9ff55dde78c4ff909e07562817471406cb07f95313f9208cd87a482876ccec0648df38f7efe880233ed3b4c3a8d00b457f9c35"' :
                                            'id="xs-components-links-module-ProductsModule-f0d7eb5eb95f0dc62eee09a45c9ff55dde78c4ff909e07562817471406cb07f95313f9208cd87a482876ccec0648df38f7efe880233ed3b4c3a8d00b457f9c35"' }>
                                            <li class="link">
                                                <a href="components/ProductsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProductsPageRoutingModule.html" data-type="entity-link" >ProductsPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/StarComponent.html" data-type="entity-link" >StarComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AppPage.html" data-type="entity-link" >AppPage</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthenticationAPI.html" data-type="entity-link" >AuthenticationAPI</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthenticationService.html" data-type="entity-link" >AuthenticationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BaseComponent.html" data-type="entity-link" >BaseComponent</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BasePresenter.html" data-type="entity-link" >BasePresenter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GlobalsService.html" data-type="entity-link" >GlobalsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/Http2Eshop.html" data-type="entity-link" >Http2Eshop</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InitPresenter.html" data-type="entity-link" >InitPresenter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductAPI.html" data-type="entity-link" >ProductAPI</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductService.html" data-type="entity-link" >ProductService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductsPresenter.html" data-type="entity-link" >ProductsPresenter</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AdminLoginInput.html" data-type="entity-link" >AdminLoginInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminLoginResponse.html" data-type="entity-link" >AdminLoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetProductsResponse.html" data-type="entity-link" >GetProductsResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IHttp2EshopReq.html" data-type="entity-link" >IHttp2EshopReq</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProduct.html" data-type="entity-link" >IProduct</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProductResolved.html" data-type="entity-link" >IProductResolved</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterProductResponse.html" data-type="entity-link" >RegisterProductResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateProductResponse.html" data-type="entity-link" >UpdateProductResponse</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});