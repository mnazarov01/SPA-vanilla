
import cityCreator from './cityCreator';
import OrderHandler from '../handlers/order';

let objectsNeedDestroy = null;

const Order = {

  render: () => `${cityCreator.render()}
        <div id="loading_wrapper_create-order">
            <svg class="loading" width="110" heigth="110" viewBox="0 0 110 110">
                <circle r="30" cx="55" cy="55" stroke="#f0f0f020" fill="none" stroke-width="12px"></circle>
                <circle class="loading__progress" r="30" cx="55" cy="55" fill="none" stroke="#f77a52"
                    stroke-width="13px">
                </circle>
            </svg>
        </div>

        <form id="order_form" method="POST">
        <div class="order_main_wrapper">
            <div class="order_wrapper">
                <div class="input input__order-type">
                    <div class="input__field input__field-menu">
                        <img class="input__field-menu-current-image" src="/public/images/box-white.svg">
                        <span class="input__field-menu-current --selected">Обычный</span>
                    </div>
    
                    <label class="input__label input__label-menu" data-content="Вид перевозки">
                        <span class="input__label-content input__label-content-name">Вид перевозки</span>
                    </label>
    
                    <ul class="input__label-content-menu">
                        <li data-uid="1">
                            <img class="input__label-menu-current-point" src="/public/images/box-white.svg">
                            <span data-content="Обычный"><span>Обычный</span></span>
                        </li>
                        <li data-uid="2">
                            <img class="input__label-menu-current-point" src="/public/images/air-freight-white.svg">
                            <span data-content="Авиа"><span>Авиа</span></span>
                        </li>
                        <li data-uid="3">
                            <img class="input__label-menu-current-point" src="/public/images/startup-white.svg">
                            <span data-content="1 класс"><span>1 класс</span></span>
                        </li>
                    </ul>
                </div>
    
                <div class="important_fields">
    
                    <div class="input input__field-search-from-wrapper">
                        <input class="input__field input__field-search" type="text" id="input-from">
                        <label class="input__label input__label-search" data-content="Откуда">
                            <span class="input__label-content input__label-content-name">Откуда</span>
                        </label>
                        <label class="input__label--search"></label>
                        <ul id="input-from-search" class="search-engine">
                            <li style="display: none;">
                                <div class="loading_dots">
                                    <span class="dot"></span>
                                    <div class="dots">    
                                        <span></span>
                                        <span></span>
                                        <span></span>    
                                    </div> 
                                </div>
                            </li>
                        </ul>
                    </div>
    
                    <div class="input input__field-search-to-wrapper">
                        <input class="input__field input__field-search" type="text" id="input-to">
                        <label class="input__label input__label-search" data-content="Куда">
                            <span class="input__label-content input__label-content-name">Куда</span>
                        </label>
                        <label class="input__label--search"></label>
                        <ul id="input-to-search" class="search-engine">
                            <li style="display: none;">
                                <div class="loading_dots">
                                    <span class="dot"></span>
                                    <div class="dots">    
                                        <span></span>
                                        <span></span>
                                        <span></span>    
                                    </div> 
                                </div>
                            </li>
                        </ul>
                    </div>
    
                    <div class="input input__field-weight-wrapper">
                        <input class="input__field input__field-number" id="input-weight" placeholder="0">
    
                        <label class="input__label input__label-weight" data-content="Вес">
                            <span class="input__label-content input__label-content-name">Вес</span>
                        </label>
                    </div>
    
                    <div class="input input__field-volume-wrapper">
                        <input class="input__field input__field-number" id="input-volume" placeholder="0.00">
    
                        <label class="input__label input__label-volume" data-content="Объем">
                            <span class="input__label-content input__label-content-name">Объем</span>
                        </label>
                    </div>
    
                    <div class="input input__field-date-wrapper">
                        <input class="input__field input__field-date" id="input-date" placeholder="дд.мм.гггг">
    
                        <label class="input__label input__label-date" data-content="Дата когда забрать груз">
                            <span class="input__label-content input__label-content-name">Дата когда забрать груз</span>
                        </label>
                    </div>
    
                    <div class="input__packaging">
                    
                        <div class="input input__field-box-wrapper">
        
                            <input class="input__field input__field-box" id="input-box" placeholder="0">
        
                            <label class="input__label input__label-box" data-content="Коробка">
                                <span class="input__label-content input__label-content-name">Коробка</span>
                            </label>
        
                        </div>
                        <div class="input input__field-flim-wrapper">
        
                            <input class="input__field input__field-film" id="input-film" placeholder="0">
        
                            <label class="input__label input__label-film" data-content="Пленка">
                                <span class="input__label-content input__label-content-name">Пленка</span>
                            </label>
        
                        </div>
                        <div class="input input__field-bag-wrapper">
        
                            <input class="input__field input__field-bag" id="input-bag" placeholder="0">
        
                            <label class="input__label input__label-bag" data-content="Мешок">
                                <span class="input__label-content input__label-content-name">Мешок</span>
                            </label>
        
                        </div>

                    </div>
    
                </div>
    
                <div class="input">
                    <input class="order__submit" type="submit" value="Оформить">
                </div>
            </div>
    
            <div class="calculate">
                <div class="calculate-header">
                    <span class="calculate-header-detail_label">Детализация заказа</span>
                    <span class="calculate-header-arrow">
                        <span class="calculate-header-arrow-left"></span>
                        <span class="calculate-header-arrow-right"></span>
                    </span>
                </div>
                <div class="calculate-separator"></div>
                <div class="calculate-info">
                    <div id="loading_wrapper_calculator">
                        <svg class="loading" width="110" heigth="110" viewBox="0 0 110 110">
                            <circle r="30" cx="55" cy="55" stroke="#f0f0f020" fill="none" stroke-width="12px"></circle>
                            <circle class="loading__progress" r="30" cx="55" cy="55" fill="none" stroke="#f77a52"
                                stroke-width="13px">
                            </circle>
                        </svg>
                    </div>
                    <ul id="data-calculate">
                        <li>Детали расчета</li>
                        <li>Для расчета стоимости необходимо ввести данные ...</li>
                    </ul>
                </div>
    
            </div>
        </div>
        </form>`,

  afterRender: () => {
    objectsNeedDestroy = OrderHandler();
  },

  preRender: () => {
    objectsNeedDestroy.destructor();
  },
};

export default Order;
