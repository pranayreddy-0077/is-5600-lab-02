document.addEventListener('DOMContentLoaded', () => {
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);

  const userListEl = document.querySelector('.user-list');
  const portfolioListEl = document.querySelector('.portfolio-list');
  const stockAreaEl = document.querySelector('.stock-form');

  const idEl = document.querySelector('#userID');
  const firstEl = document.querySelector('#firstname');
  const lastEl = document.querySelector('#lastname');
  const addressEl = document.querySelector('#address');
  const cityEl = document.querySelector('#city');
  const emailEl = document.querySelector('#email');

  const saveBtn = document.querySelector('#saveButton');
  const deleteBtn = document.querySelector('#deleteButton');

  const stockNameEl = document.querySelector('#stockName');
  const stockSectorEl = document.querySelector('#stockSector');
  const stockIndustryEl = document.querySelector('#stockIndustry');
  const stockAddrEl = document.querySelector('#stockAddress');
  const logoImgEl = document.querySelector('#logo');

  function generateUserList(users, stocks) {
    userListEl.innerHTML = '';
    users.forEach(({ user, id }) => {
      const li = document.createElement('li');
      li.textContent = `${user.lastname}, ${user.firstname}`;
      li.setAttribute('data-id', id);
      userListEl.appendChild(li);
    });
    userListEl.onclick = (evt) => handleUserListClick(evt, users, stocks);
  }

  function handleUserListClick(event, users, stocks) {
    const target = event.target;
    const userId = target.getAttribute('data-id');
    if (!userId) return;
    const userObj = users.find(u => String(u.id) === String(userId));
    if (!userObj) return;
    populateForm(userObj);
    renderPortfolio(userObj, stocks);
    clearStockPanel();
  }

  function populateForm(data) {
    const { user, id } = data;
    idEl.value = id ?? '';
    firstEl.value = user?.firstname ?? '';
    lastEl.value = user?.lastname ?? '';
    addressEl.value = user?.address ?? '';
    cityEl.value = user?.city ?? '';
    emailEl.value = user?.email ?? '';
  }

  function renderPortfolio(user, stocks) {
    portfolioListEl.innerHTML = '';
    const { portfolio = [] } = user;
    portfolio.forEach(({ symbol, owned }) => {
      const row = document.createElement('div');
      row.className = 'portfolio-row';
      const symbolEl = document.createElement('p');
      symbolEl.textContent = symbol;
      const sharesEl = document.createElement('p');
      sharesEl.textContent = owned;
      const btn = document.createElement('button');
      btn.textContent = 'View';
      btn.setAttribute('data-symbol', symbol);
      row.appendChild(symbolEl);
      row.appendChild(sharesEl);
      row.appendChild(btn);
      portfolioListEl.appendChild(row);
    });
    portfolioListEl.onclick = (evt) => {
      if (evt.target.tagName === 'BUTTON') {
        const sym = evt.target.getAttribute('data-symbol');
        if (sym) viewStock(sym, stocks);
      }
    };
  }

  function viewStock(symbol, stocks) {
    const stock = stocks.find(s => String(s.symbol) === String(symbol));
    if (!stock) return;
    stockNameEl.textContent = stock.name ?? '';
    stockSectorEl.textContent = stock.sector ?? '';
    stockIndustryEl.textContent = stock.subIndustry ?? '';
    stockAddrEl.textContent = stock.address ?? '';
    logoImgEl.src = `logos/${symbol}.svg`;
  }

  function clearStockPanel() {
    stockNameEl.textContent = '';
    stockSectorEl.textContent = '';
    stockIndustryEl.textContent = '';
    stockAddrEl.textContent = '';
    logoImgEl.removeAttribute('src');
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = idEl.value;
      if (!id) return;
      for (let i = 0; i < userData.length; i++) {
        if (String(userData[i].id) === String(id)) {
          userData[i].user.firstname = firstEl.value ?? userData[i].user.firstname;
          userData[i].user.lastname = lastEl.value ?? userData[i].user.lastname;
          userData[i].user.address = addressEl.value ?? userData[i].user.address;
          userData[i].user.city = cityEl.value ?? userData[i].user.city;
          userData[i].user.email = emailEl.value ?? userData[i].user.email;
          generateUserList(userData, stocksData);
          const stillThere = userData[i];
          populateForm(stillThere);
          renderPortfolio(stillThere, stocksData);
          break;
        }
      }
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = idEl.value;
      if (!id) return;
      const idx = userData.findIndex(u => String(u.id) === String(id));
      if (idx >= 0) {
        userData.splice(idx, 1);
        idEl.value = '';
        firstEl.value = '';
        lastEl.value = '';
        addressEl.value = '';
        cityEl.value = '';
        emailEl.value = '';
        portfolioListEl.innerHTML = '';
        clearStockPanel();
        generateUserList(userData, stocksData);
      }
    });
  }

  generateUserList(userData, stocksData);
});

