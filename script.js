/*Константы */
const player_points = [501,501,501,501,501,501];
const coords = {1:{x:[],y:[]},2:{x:[],y:[]},3:{x:[],y:[]},4:{x:[],y:[]},5:{x:[],y:[]},6:{x:[],y:[]}};
const game_finished = [1,1,1,1,1,1];
const workers = [];
const workers_id = [];
const game_result=[];
const last_leg = [50];
let winners = 1;
let losers = 1;
let totalsum = 1;
const archive = [];
const game_status =[0]; /* Варианты game (0) - игра, 
finish(1) - первый закрылся и выбран режим окончания, 
last_round(2) - первый закрылся, но у тех кто после него есть шанс на ничью
continue(3) - до последнего проигравшего*/


/* Получить список имен из таблички*/
function getWorkers() {
    const url = `https://docs.google.com/spreadsheets/d/1AdB_r8gGwHfgd7MUdf03U9kUzK8yk9KzjW7B9MLaH3w/gviz/tq?gid=0`;
    fetch(url)
    .then(res => res.text())
    .then(rep => {
        const data2 = JSON.parse(rep.substr(47).slice(0,-2));
        const length = data2.table.rows.length;
        for (let i=1; i<length; i+=1) {
            workers.push(data2.table.rows[i].c[0].v)
            workers_id.push(data2.table.rows[i].c[1].v);
        }
    })
    // fetch('https://sheetdb.io/api/v1/cm1u7k6z6rd10?sheet=resulttable')
    // .then((response) => response.json())
    // .then((data) => console.log(data));
}
window.onload = getWorkers();
window.onload = getStatistics();
/*После выбора числа игроков написать имена*/
document.getElementById('player_count').addEventListener('change', addNames);
document.getElementById('input_pass').addEventListener('change',showStatButton);
/*Блок статистики */
function showStatButton() {
    if(document.getElementById('input_pass').value=="MG1") {
        document.getElementById('statistics_button').classList.remove('hide');
    }
}
document.getElementById('statistics_button').addEventListener('click',showStatisticsPage);
document.getElementById('statistics_from_end').addEventListener('click',showStatisticsPageTimeGap);

function showStatisticsPageTimeGap() {
    archive.length=0;
    document.getElementById('body').classList.add('loading');
    getStatistics();
    setTimeout(()=>{
        document.getElementById('body').classList.remove('loading');
        showStatisticsPage()
    },3500);
}

function showStatisticsPage () {
    document.getElementById('game_settings').classList.add('hide');
    document.getElementById('game_field').classList.add('hide');
    document.getElementById('final_result').classList.add('hide');
    createStatisticsTable();
    document.getElementById('statistics').classList.remove('hide');
    showStatistics(3);
}
document.getElementById('1day').addEventListener('click', function() {showStatistics(1)});
document.getElementById('1month').addEventListener('click',function() {showStatistics(2)});
document.getElementById('alltime').addEventListener('click',function() {showStatistics(3)});
function showStatistics(period) {
    if (period == 1) {
        document.getElementById('1day').classList.add('active');
        document.getElementById('1month').classList.remove('active');
        document.getElementById('alltime').classList.remove('active');
        createStatistics(1);
    } else if (period == 2) {
        document.getElementById('1day').classList.remove('active');
        document.getElementById('1month').classList.add('active');
        document.getElementById('alltime').classList.remove('active');
        createStatistics(2);
    } else {
        document.getElementById('1day').classList.remove('active');
        document.getElementById('1month').classList.remove('active');
        document.getElementById('alltime').classList.add('active');
        createStatistics(3);
    }
}

function createStatisticsTable() {
    const table = document.createElement('table');
    table.className = 'supertable_s';
    const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const players_column_width = (width - 50) / (workers.length + 4);
    const headers = ['Игрок','Лучший бросок', 'Лучшее закрытие', 'Быстрая победа', 'Лучший ср.170','Общий счет', '% побед'];
    for (let i=0; i<=workers.length; i+=1) {
        const tr = table.insertRow();
        tr.className = 'superrow_s';
        for (let j=0; j<=workers.length+7; j+=1) {
            const td = tr.insertCell();
            if (j===0) {
                td.className = 'ordercell_s';
                if (i>0) td.appendChild(document.createTextNode(`${i}`))
            } else {
                if (j===1 && i>0) td.appendChild(document.createTextNode(`${workers[i-1]}`))
                td.className = 'supercell_s';
                if (i>0 && i===(j-5)) td.classList.add('colored');
                td.style.width = `${players_column_width}px`;
                if (i===0) {
                    if (j<6) td.appendChild(document.createTextNode(`${headers[j-1]}`));
                    else if (j>(5+workers.length)) td.appendChild(document.createTextNode(`${headers[j-1-workers.length]}`));
                    else td.appendChild(document.createTextNode(`${workers[j-6]}`));
                }
            };
        }
    }
    document.getElementById('statistics_field').appendChild(table);
}

function createStatistics(period) {
    const timegap = period==1? 12*60*60*1000: period==2? 24*30*60*60*1000 : Infinity; 
    for (let i=0; i<workers.length; i+=1) {
        const arr1 = archive.filter((el)=> (el.player1 == workers[i] && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.bestshot1)})
        const arr2 = archive.filter((el)=> (el.player2 == workers[i] && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.bestshot2)})
        const arr3 = archive.filter((el)=> (el.player3 == workers[i] && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.bestshot3)})
        const arr4 = archive.filter((el)=> (el.player4 == workers[i] && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.bestshot4)})
        const arr5 = archive.filter((el)=> (el.player5 == workers[i] && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.bestshot5)})
        const arr6 = archive.filter((el)=> (el.player6 == workers[i] && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.bestshot6)})
        let result = arr1.concat(arr2).concat(arr3).concat(arr4).concat(arr5).concat(arr6);
        if (result.length >0) document.querySelectorAll('.superrow_s')[i+1].children[2].innerText = `${Math.max.apply(null, result)}`
        else document.querySelectorAll('.superrow_s')[i+1].children[2].innerText = ``;
    }
    for (let i=0; i<workers.length; i+=1) {
        const arr1 = archive.filter((el)=> (el.player1 == workers[i] && !isNaN(el.finish1) && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.finish1)})
        const arr2 = archive.filter((el)=> (el.player2 == workers[i] && !isNaN(el.finish2) && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.finish2)})
        const arr3 = archive.filter((el)=> (el.player3 == workers[i] && !isNaN(el.finish3) && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.finish3)})
        const arr4 = archive.filter((el)=> (el.player4 == workers[i] && !isNaN(el.finish4) && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.finish4)})
        const arr5 = archive.filter((el)=> (el.player5 == workers[i] && !isNaN(el.finish5) && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.finish5)})
        const arr6 = archive.filter((el)=> (el.player6 == workers[i] && !isNaN(el.finish6) && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.finish6)})
        let result = arr1.concat(arr2).concat(arr3).concat(arr4).concat(arr5).concat(arr6);
        if (result.length >0) document.querySelectorAll('.superrow_s')[i+1].children[3].innerText = `${Math.max.apply(null, result)}`
        else document.querySelectorAll('.superrow_s')[i+1].children[3].innerText = ``;
    }
    for (let i=0; i<workers.length; i+=1) {
        const arr1 = archive.filter((el)=> (el.player1 == workers[i] && !isNaN(el.round1) && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.round1)})
        const arr2 = archive.filter((el)=> (el.player2 == workers[i] && !isNaN(el.round2) && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.round2)})
        const arr3 = archive.filter((el)=> (el.player3 == workers[i] && !isNaN(el.round3) && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.round3)})
        const arr4 = archive.filter((el)=> (el.player4 == workers[i] && !isNaN(el.round4) && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.round4)})
        const arr5 = archive.filter((el)=> (el.player5 == workers[i] && !isNaN(el.round5) && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.round5)})
        const arr6 = archive.filter((el)=> (el.player6 == workers[i] && !isNaN(el.round6) && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.round6)})
        let result = arr1.concat(arr2).concat(arr3).concat(arr4).concat(arr5).concat(arr6);
        if (result.length >0) document.querySelectorAll('.superrow_s')[i+1].children[4].innerText = `${Math.min.apply(null, result)}`
        else document.querySelectorAll('.superrow_s')[i+1].children[4].innerText = ``;
    }
    for (let i=0; i<workers.length; i+=1) {
        const arr1 = archive.filter((el)=> (el.player1 == workers[i] && !isNaN(el.avg1701) && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.avg1701)})
        const arr2 = archive.filter((el)=> (el.player2 == workers[i] && !isNaN(el.avg1702) && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.avg1702)})
        const arr3 = archive.filter((el)=> (el.player3 == workers[i] && !isNaN(el.avg1703) && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.avg1703)})
        const arr4 = archive.filter((el)=> (el.player4 == workers[i] && !isNaN(el.avg1704) && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.avg1704)})
        const arr5 = archive.filter((el)=> (el.player5 == workers[i] && !isNaN(el.avg1705) && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.avg1705)})
        const arr6 = archive.filter((el)=> (el.player6 == workers[i] && !isNaN(el.avg1706) && (new Date() - new Date(el.date) < timegap))).map((el)=> {return Number(el.avg1706)})
        let result = arr1.concat(arr2).concat(arr3).concat(arr4).concat(arr5).concat(arr6);
        if (result.length >0) document.querySelectorAll('.superrow_s')[i+1].children[5].innerText = `${Math.max.apply(null, result)}`
        else document.querySelectorAll('.superrow_s')[i+1].children[5].innerText = ``;
    }
    for (let i=0; i<workers.length; i+=1) {
        for (let j=0; j<workers.length; j+=1) {
            const arr1 = archive.filter((el)=> (el.losers*el.winners)%workers_id[i] == 0 && (el.losers*el.winners)%workers_id[j] == 0 && i!=j  && (new Date() - new Date(el.date) < timegap)).map((el)=> {
                return el.losers%workers_id[i]==0 && el.winners%workers_id[j]==0 ? -1: el.losers%workers_id[j]==0 && el.winners%workers_id[i]==0? 1 : 0; 
            })
            let positive = arr1.filter(elem =>(elem > 0)).length;
            let negative = arr1.filter(elem =>(elem < 0)).length;
            if (arr1.length >0) document.querySelectorAll('.superrow_s')[i+1].children[j+6].innerText = `${positive} - ${negative}`
            else document.querySelectorAll('.superrow_s')[i+1].children[j+6].innerText = ``;
        }
    }
    for (let i=0; i<workers.length; i+=1) {
        const arr1 = archive.filter((el)=> (el.losers*el.winners)%workers_id[i] == 0   && (new Date() - new Date(el.date) < timegap)).map((el)=> {
            return el.losers%workers_id[i]==0? -1: el.winners%workers_id[i]==0? 1 : 0; 
        })
        let positive = arr1.filter(elem =>(elem > 0)).length;
        let negative = arr1.filter(elem =>(elem < 0)).length;
        if (arr1.length >0) document.querySelectorAll('.superrow_s')[i+1].children[workers.length+6].innerText = `${positive} - ${negative}`
        else document.querySelectorAll('.superrow_s')[i+1].children[workers.length+6].innerText = ``;
        if (arr1.length >0) document.querySelectorAll('.superrow_s')[i+1].children[workers.length+7].innerText = `${Math.round(positive/(positive+negative)*100)}% (${positive}/${positive+negative})`
        else document.querySelectorAll('.superrow_s')[i+1].children[workers.length+7].innerText = ``;
    }
    
}

function getStatistics() {
    const url = `https://docs.google.com/spreadsheets/d/1AdB_r8gGwHfgd7MUdf03U9kUzK8yk9KzjW7B9MLaH3w/gviz/tq?gid=1749488065`;
    fetch(url)
    .then(res => res.text())
    .then(rep => {
        const data2 = JSON.parse(rep.substr(47).slice(0,-2));
        const length = data2.table.rows.length;
        for (let i=0; i<length; i+=1) {
            const game = new Object();
            game.date = data2.table.rows[i].c[0] ? data2.table.rows[i].c[0].v : "-";
            game.player1 = data2.table.rows[i].c[1] ? data2.table.rows[i].c[1].v : "-";
            game.result1 = data2.table.rows[i].c[2] ? data2.table.rows[i].c[2].v : "-";
            game.round1 = data2.table.rows[i].c[3] ? data2.table.rows[i].c[3].v : "-";
            game.avg1701 = data2.table.rows[i].c[4] ? data2.table.rows[i].c[4].v : "-";
            game.bestshot1 = data2.table.rows[i].c[5] ? data2.table.rows[i].c[5].v : "-";
            game.finish1 = data2.table.rows[i].c[6] ? data2.table.rows[i].c[6].v : "-";
            game.player2 = data2.table.rows[i].c[7] ? data2.table.rows[i].c[7].v : "-";
            game.result2 = data2.table.rows[i].c[8] ? data2.table.rows[i].c[8].v : "-";
            game.round2 = data2.table.rows[i].c[9] ? data2.table.rows[i].c[9].v : "-";
            game.avg1702 = data2.table.rows[i].c[10] ? data2.table.rows[i].c[10].v : "-";
            game.bestshot2 = data2.table.rows[i].c[11] ? data2.table.rows[i].c[11].v : "-";
            game.finish2 = data2.table.rows[i].c[12] ? data2.table.rows[i].c[12].v : "-";
            game.player3 = data2.table.rows[i].c[13] ? data2.table.rows[i].c[13].v : "-";
            game.result3 = data2.table.rows[i].c[14] ? data2.table.rows[i].c[14].v : "-";
            game.round3 = data2.table.rows[i].c[15] ? data2.table.rows[i].c[15].v : "-";
            game.avg1703 = data2.table.rows[i].c[16] ? data2.table.rows[i].c[16].v : "-";
            game.bestshot3 = data2.table.rows[i].c[17] ? data2.table.rows[i].c[17].v : "-";
            game.finish3 = data2.table.rows[i].c[18] ? data2.table.rows[i].c[18].v : "-";
            game.player4 = data2.table.rows[i].c[19] ? data2.table.rows[i].c[19].v : "-";
            game.result4 = data2.table.rows[i].c[20] ? data2.table.rows[i].c[20].v : "-";
            game.round4 = data2.table.rows[i].c[21] ? data2.table.rows[i].c[21].v : "-";
            game.avg1704 = data2.table.rows[i].c[22] ? data2.table.rows[i].c[22].v : "-";
            game.bestshot4 = data2.table.rows[i].c[23] ? data2.table.rows[i].c[23].v : "-";
            game.finish4 = data2.table.rows[i].c[24] ? data2.table.rows[i].c[24].v : "-";
            game.player5 = data2.table.rows[i].c[25] ? data2.table.rows[i].c[25].v : "-";
            game.result5 = data2.table.rows[i].c[26] ? data2.table.rows[i].c[26].v : "-";
            game.round5 = data2.table.rows[i].c[27] ? data2.table.rows[i].c[27].v : "-";
            game.avg1705 = data2.table.rows[i].c[28] ? data2.table.rows[i].c[28].v : "-";
            game.bestshot5 = data2.table.rows[i].c[29] ? data2.table.rows[i].c[29].v : "-";
            game.finish5 = data2.table.rows[i].c[30] ? data2.table.rows[i].c[30].v : "-";
            game.player6 = data2.table.rows[i].c[31] ? data2.table.rows[i].c[31].v : "-";
            game.result6 = data2.table.rows[i].c[32] ? data2.table.rows[i].c[32].v : "-";
            game.round6 = data2.table.rows[i].c[33] ? data2.table.rows[i].c[33].v : "-";
            game.avg1706 = data2.table.rows[i].c[34] ? data2.table.rows[i].c[34].v : "-";
            game.bestshot6 = data2.table.rows[i].c[35] ? data2.table.rows[i].c[35].v : "-";
            game.finish6 = data2.table.rows[i].c[36] ? data2.table.rows[i].c[36].v : "-";
            game.winners = data2.table.rows[i].c[37] ? data2.table.rows[i].c[37].v : "-";
            game.losers = data2.table.rows[i].c[38] ? data2.table.rows[i].c[38].v : "-";;
            game.players = data2.table.rows[i].c[39] ? data2.table.rows[i].c[39].v : "-";
            archive.push(game);
        }
    })
}

function addNames() {
    document.getElementById('players_name').innerHTML='';
    document.getElementById('start_button').classList.add('hide');
    const players_number = document.getElementById('player_count').value;
    if (!isNaN(players_number)) {
        if(document.getElementById('input_pass').value=="MG1"){
            for (let i=0; i<players_number; i+=1) {
                const names = document.createElement('select');
                names.placeholder = `Игрок ${i+1}`;
                names.className = 'write_name';
                names.id = `name_${i+1}`
                document.getElementById('players_name').appendChild(names);
                for (let i=0; i<workers.length; i+=1) {
                    let option = document.createElement('option');
                    option.value = workers[i];
                    option.text = workers[i];
                    option.id = workers_id[i];
                    names.appendChild(option);
                }
                game_finished[i] = 0;
            }
            document.getElementById('start_button').classList.remove('hide');
        } else {
            for (let i=0; i<players_number; i+=1) {
                const names = document.createElement('input');
                names.placeholder = `Игрок ${i+1}`;
                names.className = 'write_name';
                names.id = `name_${i+1}`
                document.getElementById('players_name').appendChild(names);
                game_finished[i] = 0;
            }
            document.getElementById('start_button').classList.remove('hide');
        }
    }
}

/*После ввода имен старт игры - убирает окно настроек, открывает окно игры*/
document.getElementById('start_button').addEventListener('click', startGame);
function startGame() {
    document.getElementById('game_settings').classList.add('hide');
    document.getElementById('game_field').classList.remove('hide');
    const players_number = document.getElementById('player_count').value;
    for (let i=0; i<players_number; i+=1) {
        game_finished[i]=0;
        const person = new Object();
        person.name = document.getElementById(`name_${i+1}`).value;
        person.id = workers_id[workers.indexOf(document.getElementById(`name_${i+1}`).value)];
        person.result = 0;
        person.finished = 0;
        person.round = '-';
        person.average170 = 0;
        person.best = 0;
        person.close = '-';
        person.shots=[];
        person.remains=[];
        game_result.push(person);
        totalsum *= person.id;
    }
    for (let i=0; i<6-players_number; i+=1) {
        const person = new Object();
        person.name = '-';
        person.result = '-';
        person.finished = '-';
        person.round = '-';
        person.average170 = '-';
        person.best = '-';
        person.close = '-';
        person.shots=[];
        person.remains=[];
        game_result.push(person);
    }
    const table = document.createElement('table');
    table.className = 'supertable';
    const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const players_column_width = (width - 50) / players_number;
    for (let i=0; i<51; i+=1) {
        const tr = table.insertRow();
        tr.className = 'superrow';
        for (let j=0; j<=players_number; j+=1) {
            const td = tr.insertCell();
            if (j===0) {
                td.className = 'ordercell';
                if (i>0) td.appendChild(document.createTextNode(`${i}`))
            } else {
                td.className = 'supercell';
                td.style.width = `${players_column_width}px`;
                if (i===0) td.appendChild(document.createTextNode(`${document.getElementById(`name_${j}`).value}`));
            };
        }
    }
    document.getElementById('table_field').appendChild(table);
    nextTurn();
}

/*После создания игры делаем ход. Начинает игрок 1*/
let current_player = 1;
let dart_left = 3;
let current_move_number = 1;
let darts_center_x = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) * 0.8 - 2.5; /* -2 - эксперимент, хз почему так */
let darts_center_y = 249.5;

function nextTurn() {
    document.getElementById('test_round').classList.add('hide');
    document.getElementById('current_player').innerText = `${document.getElementById(`name_${current_player}`).value}`;
    document.getElementById('current_player_left').innerText = `${player_points[current_player-1]}`;
    let player_finishing = 0;
    document.getElementById('current_player_finishing').classList.add('hide');
    if(player_points[current_player-1]<171) {
        if (player_points[current_player-1]<41 && player_points[current_player-1]%2===0) player_finishing=`D${player_points[current_player-1]/2}`;
        else if (player_points[current_player-1]<41 && player_points[current_player-1]%2!==0) player_finishing=`1 D${(player_points[current_player-1]-1)/2}`;
        else if (player_points[current_player-1]==50) player_finishing=`Bull`;
        else if (player_points[current_player-1]<61) player_finishing=`${player_points[current_player-1]-40} D20`;
        else if (player_points[current_player-1]<99 && player_points[current_player-1]%2===0) player_finishing=`T20 D${(player_points[current_player-1]-60)/2}`;
        else if (player_points[current_player-1]<99 && player_points[current_player-1]%2!==0) player_finishing=`T19 D${(player_points[current_player-1]-57)/2}`;
        else if (player_points[current_player-1]==100) player_finishing=`T20 D20`;
        else if (player_points[current_player-1]<159) {
            if (player_points[current_player-1]-60<41 && (player_points[current_player-1]-60)%2===0) player_finishing=`T20 D${(player_points[current_player-1]-60)/2}`;
            else if (player_points[current_player-1]-60<41 && (player_points[current_player-1]-60)%2!==0) player_finishing=`T20 1 D${(player_points[current_player-1]-61)/2}`;
            else if (player_points[current_player-1]-60==50) player_finishing=`T20 Bull`;
            else if (player_points[current_player-1]-60<61) player_finishing=`T20 ${player_points[current_player-1]-100} D20`;
            else if (player_points[current_player-1]-60<99 && (player_points[current_player-1]-60)%2===0) player_finishing=`T20 T20 D${(player_points[current_player-1]-120)/2}`;
            else if (player_points[current_player-1]-60<99 && (player_points[current_player-1]-60)%2!==0) player_finishing=`T20 T19 D${(player_points[current_player-1]-117)/2}`;
            }
        else if (player_points[current_player-1]==160) player_finishing=`T20 T20 D20`;
        else if (player_points[current_player-1]==161) player_finishing=`T20 T17 Bull`;
        else if (player_points[current_player-1]==164) player_finishing=`T20 T18 Bull`;
        else if (player_points[current_player-1]==167) player_finishing=`T20 T19 Bull`;
        else if (player_points[current_player-1]==170) player_finishing=`T20 T20 Bull`;
        if (player_finishing!==0) {
            document.getElementById('current_player_finishing').classList.remove('hide');
        }
    }
    document.getElementById('current_player_finishing').innerText = `(${player_finishing})`;
    document.getElementById('darts').classList.remove('disabled');
}

/*Бросок дротика*/
document.getElementById('darts').addEventListener('click', (e) => {throwDart(e)});
function throwDart(e) {
    let result = 0;
    const c = {x: darts_center_x, y: darts_center_y}
    const p0 = {x: e.clientX, y: e.clientY};
    const p1 = {x: darts_center_x+10, y: darts_center_y}
    const marker = document.createElement('p');
    marker.appendChild(document.createTextNode('o'));
    marker.className='marker';
    marker.setAttribute('style', `left: ${p0.x-2}px; top: ${p0.y-7}px;`);
    const p0c = Math.sqrt(Math.pow(c.x-p0.x,2)+Math.pow(c.y-p0.y,2)); // p0->c (b)   
    const p1c = Math.sqrt(Math.pow(c.x-p1.x,2)+Math.pow(c.y-p1.y,2)); // p1->c (a)
    const p0p1 = Math.sqrt(Math.pow(p1.x-p0.x,2)+Math.pow(p1.y-p0.y,2)); // p0->p1 (c)
    let angle = Math.acos((p1c*p1c+p0c*p0c-p0p1*p0p1)/(2*p1c*p0c))*180/Math.PI;
    if (p0.y>c.y) angle = 360-angle;
    let sector = 0;
    if (angle < 9) sector = 6;
    else if (angle < 27) sector = 13;
    else if (angle < 45) sector = 4;
    else if (angle < 63) sector = 18;
    else if (angle < 81) sector = 1;
    else if (angle < 99) sector = 20;
    else if (angle < 117) sector = 5;
    else if (angle < 135) sector = 12;
    else if (angle < 153) sector = 9;
    else if (angle < 171) sector = 14;
    else if (angle < 189) sector = 11;
    else if (angle < 207) sector = 8;
    else if (angle < 225) sector = 16;
    else if (angle < 243) sector = 7;
    else if (angle < 261) sector = 19;
    else if (angle < 279) sector = 3;
    else if (angle < 297) sector = 17;
    else if (angle < 315) sector = 2;
    else if (angle < 333) sector = 15;
    else if (angle < 351) sector = 10;
    else sector = 6;
    if(p0c <= 7.5) result = 50;
    else if (p0c <= 19) result = 25;
    else if (p0c <= 107.5) result = sector;
    else if (p0c <= 120) result = sector*3;
    else if (p0c <= 178) result = sector;
    else if (p0c <= 190) result = sector*2;
    else result = 0;
    
    if (dart_left === 3) {
        document.getElementById('throw_1').innerText = `${result}`;
        document.getElementById('throw_1_container').classList.remove('hide');
        if (result<Number(document.getElementById('current_player_left').innerText)-1) {
            document.getElementById('throw_1_real').innerText="1";
        } else {
            document.getElementById('throw_1_real').innerText="0";
        }
        marker.id = 'marker_1';
    } else if (dart_left === 2) {
        document.getElementById('throw_2').innerText = `${result}`;
        document.getElementById('throw_2_container').classList.remove('hide');
        if (result<Number(document.getElementById('current_player_left').innerText)-1) {
            document.getElementById('throw_2_real').innerText="1";
        } else {
            document.getElementById('throw_2_real').innerText="0";
        }
        marker.id = 'marker_2';
    } else if (dart_left === 1) {
        document.getElementById('throw_3').innerText = `${result}`;
        document.getElementById('throw_3_container').classList.remove('hide');
        if (result<Number(document.getElementById('current_player_left').innerText)-1) {
            document.getElementById('throw_3_real').innerText="1";
        } else {
            document.getElementById('throw_3_real').innerText="0";
        }
        marker.id = 'marker_3';
        document.getElementById('darts').classList.add('disabled');
        document.getElementById('next_turn').classList.remove('disabled');
    }
    dart_left -=1;
    document.body.appendChild(marker);
    updateLeft(result,p0c, current_player,dart_left);
    if (game_finished[current_player-1] === 0) {
        coords[current_player].x.push(p0.x-2);
        coords[current_player].y.push(p0.y-7);
    }
}

/* Переход хода */
document.getElementById('next_turn').addEventListener('click', newMove);
function newMove() {
    document.getElementById('next_turn').classList.add('disabled');
    const sum = document.getElementById('throw_sum').innerText;
    player_points[current_player-1] -= sum;
    game_result[current_player-1].shots.push(Number(sum));
    game_result[current_player-1].remains.push(Number(player_points[current_player-1]));
    // all_points[current_player].push(sum);
    // final_countdown[current_player].push(player_points[current_player-1]);
    document.querySelectorAll('.superrow')[current_move_number].children[current_player].innerText = `${sum}/${player_points[current_player-1]}`;
    if (Number(current_player) === Number(document.getElementById('player_count').value)) {
        current_player = game_result[0].finished==0? 1 :
                         game_result[1].finished==0? 2 :
                         game_result[2].finished==0? 3 :
                         game_result[3].finished==0? 4 :
                         game_result[4].finished==0? 5 : 6;
        current_move_number +=1;
    } else {
        let new_array = game_finished.slice(current_player);
        if (new_array.indexOf(0)>=0) {
            current_player += new_array.indexOf(0)+1;
        } else {
            current_move_number +=1;
            current_player = game_finished.indexOf(0)+1;
        }
    }
    dart_left = 3;
    document.getElementById('throw_1_container').classList.add('hide');
    document.getElementById('throw_2_container').classList.add('hide');
    document.getElementById('throw_3_container').classList.add('hide');
    document.getElementById('throw_sum').innerText = '';
    if(document.getElementById('marker_1')) document.body.removeChild(document.getElementById('marker_1'));
    if(document.getElementById('marker_2')) document.body.removeChild(document.getElementById('marker_2'));
    if(document.getElementById('marker_3')) document.body.removeChild(document.getElementById('marker_3'));
    nextTurn();
    if (Number(current_move_number)>Number(last_leg[0]) && Number(game_status[0])===2) finish_game();
    if (Number(game_status[0])===3) {
        const players_number = document.getElementById('player_count').value;
        let finished_sum = 0
        for (let i=0; i<players_number; i+=1) {
            finished_sum += Number(game_result[i].finished)||0;
        }
        if (players_number - finished_sum <=1) finish_game(); 
    }
}

/* Обновить графу "Осталось" при бросках */
function updateLeft(score,distance, player, dart_left) {
    const currentLeft = Number(document.getElementById('current_player_left').innerText);
    document.getElementById('current_player_finishing').classList.add('hide');
    if (Number(score) === currentLeft && ((distance > 179 && distance <190)||distance<7.5)) {
        if (game_status[0]!==3) {
            document.getElementById('result_text').innerText = `${document.getElementById(`name_${player}`).value} завершил игру`;
            document.getElementById('result_box').classList.remove('hide');
            document.getElementById('fireworks').classList.remove('hide');
            document.getElementById('fireworks').play();
        }
        // setTimeout(()=>{document.getElementById('result_text').classList.add('hide')},3000);
        game_finished[player-1] = 1;
        game_result[player-1].finished = 1;
        document.getElementById('next_turn').classList.remove('disabled');
        document.getElementById('current_player_left').innerText = `${currentLeft - Number(score)}`;
        document.getElementById('throw_sum').innerText = `${score+Number(document.getElementById('throw_sum').innerText)}`;
        newMove();
    }
    if (Number(score) < currentLeft && currentLeft-Number(score)>1) {
        let current_player_left = Number(currentLeft - Number(score));
        document.getElementById('current_player_left').innerText = `${currentLeft - Number(score)}`;
        document.getElementById('throw_sum').innerText = `${score+Number(document.getElementById('throw_sum').innerText)}`;
        let player_finishing = 0;
        if (dart_left==2) {
            if (current_player_left<41 && current_player_left%2===0) player_finishing=`D${current_player_left/2}`;
            else if (current_player_left<41 && current_player_left%2!==0) player_finishing=`1 D${(current_player_left-1)/2}`;
            else if (current_player_left==50) player_finishing=`Bull`;
            else if (current_player_left<61) player_finishing=`${current_player_left-40} D20`;
            else if (current_player_left<99 && current_player_left%2===0) player_finishing=`T20 D${(current_player_left-60)/2}`;
            else if (current_player_left<99 && current_player_left%2!==0) player_finishing=`T19 D${(current_player_left-57)/2}`;
            else if (current_player_left==100) player_finishing=`T20 D20`;
            else if (current_player_left==110) player_finishing=`T20 Bull`;
        } else if (dart_left==1) {
            if (current_player_left<41 && current_player_left%2===0) player_finishing=`D${current_player_left/2}`;
            else if (current_player_left==50) player_finishing=`Bull`;
        }
        document.getElementById('current_player_finishing').innerText = `(${player_finishing})`;
        if (player_finishing!==0) document.getElementById('current_player_finishing').classList.remove('hide');
    }
}

/*Тестировочный круг, добавить потом кнопку его вызова*/
function testRound(width) {
    const test = document.getElementById('test_round');
    test.classList.remove('hide');
    const left = darts_center_x - width/2;
    const top = darts_center_y - width/2
    test.setAttribute('style', `height: ${Math.round(width)}px; width: ${Math.round(width)}px; left: ${Math.round(left)}px; top: ${Math.round(top)}px;`);
}
function clearTestRound() {
    document.getElementById('test_round').classList.add('hide');
}

/* Удалить результат броска. Реализовать удаление координат броска из общего пула координат игрока*/
document.getElementById('delete_1').addEventListener('click',delete1)
function delete1() {
    if (dart_left==2) {
        dart_left=3;
        const fix_number = -Number(document.getElementById('throw_1').innerText)*Number(document.getElementById('throw_1_real').innerText);
        updateLeft(fix_number,10, current_player, dart_left);
        document.getElementById('throw_1').innerText = ``;
        document.getElementById('throw_1_container').classList.add('hide');
        document.body.removeChild(document.getElementById('marker_1'));
    }
    if (dart_left==1) {
        dart_left=2;
        const fix_number = -Number(document.getElementById('throw_1').innerText)*Number(document.getElementById('throw_1_real').innerText);
        updateLeft(fix_number,10, current_player, dart_left);
        document.getElementById('throw_1').innerText = `${document.getElementById('throw_2').innerText}`;
        document.getElementById('throw_2').innerText = ``;
        document.getElementById('throw_2_container').classList.add('hide');
        document.body.removeChild(document.getElementById('marker_1'));
        document.getElementById('marker_2').id = 'marker_1';
    }
    if (dart_left==0) {
        document.getElementById('darts').classList.remove('disabled');
        document.getElementById('next_turn').classList.add('disabled');
        dart_left=1;
        const fix_number = -Number(document.getElementById('throw_1').innerText)*Number(document.getElementById('throw_1_real').innerText);
        updateLeft(fix_number,10, current_player, dart_left);
        document.getElementById('throw_1').innerText = `${document.getElementById('throw_2').innerText}`;
        document.getElementById('throw_2').innerText = `${document.getElementById('throw_3').innerText}`;
        document.getElementById('throw_3').innerText = ``;
        document.getElementById('throw_3_container').classList.add('hide');
        document.body.removeChild(document.getElementById('marker_1'));
        document.getElementById('marker_2').id = 'marker_1';
        document.getElementById('marker_3').id = 'marker_2';
    }
}
document.getElementById('delete_2').addEventListener('click',delete2)
function delete2() {
    if (dart_left==1) {
        dart_left=2;
        const fix_number = -Number(document.getElementById('throw_2').innerText)*Number(document.getElementById('throw_2_real').innerText);
        updateLeft(fix_number,10, current_player, dart_left);
        document.getElementById('throw_2').innerText = ``;
        document.getElementById('throw_2_container').classList.add('hide');
        document.body.removeChild(document.getElementById('marker_2'));
    }
    if (dart_left==0) {
        document.getElementById('darts').classList.remove('disabled');
        document.getElementById('next_turn').classList.add('disabled');
        dart_left=1;
        const fix_number = -Number(document.getElementById('throw_2').innerText)*Number(document.getElementById('throw_2_real').innerText);
        updateLeft(fix_number,10, current_player, dart_left);
        document.getElementById('throw_2').innerText = `${document.getElementById('throw_3').innerText}`;
        document.getElementById('throw_3').innerText = ``;
        document.getElementById('throw_3_container').classList.add('hide');
        document.body.removeChild(document.getElementById('marker_2'));
        document.getElementById('marker_3').id = 'marker_2';
    }
}
document.getElementById('delete_3').addEventListener('click',delete3)
function delete3() {
    if (dart_left==0) {
        document.getElementById('darts').classList.remove('disabled');
        document.getElementById('next_turn').classList.add('disabled');
        dart_left=1;
        const fix_number = -Number(document.getElementById('throw_3').innerText)*Number(document.getElementById('throw_3_real').innerText);
        updateLeft(fix_number,10, current_player, dart_left);
        document.getElementById('throw_3').innerText = ``;
        document.getElementById('throw_3_container').classList.add('hide');
        document.body.removeChild(document.getElementById('marker_3'));
    }
}

/* Меню с результатами */
document.getElementById('new_game').addEventListener('click',new_game);
document.getElementById('return').addEventListener('click',new_game);
function new_game() {
    window.location.reload();
}

function editSpreadSheet() {
    fetch('https://sheetdb.io/api/v1/cm1u7k6z6rd10?sheet=resulttable', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: [
                {
                    'date': `${new Date().toISOString()}`,
                    'player1': `${game_result[0].name}`,
                    'result1': `${game_result[0].result}`,
                    'round1': `${game_result[0].round}`,
                    'avg1701': `${game_result[0].average170}`,
                    'bestshot1': `${game_result[0].best}`,
                    'finish1': `${game_result[0].close}`,
                    'player2': `${game_result[1].name}`,
                    'result2': `${game_result[1].result}`,
                    'round2': `${game_result[1].round}`,
                    'avg1702': `${game_result[1].average170}`,
                    'bestshot2': `${game_result[1].best}`,
                    'finish2': `${game_result[1].close}`,
                    'player3': `${game_result[2].name}`,
                    'result3': `${game_result[2].result}`,
                    'round3': `${game_result[2].round}`,
                    'avg1703': `${game_result[2].average170}`,
                    'bestshot3': `${game_result[2].best}`,
                    'finish3': `${game_result[2].close}`,
                    'player4': `${game_result[3].name}`,
                    'result4': `${game_result[3].result}`,
                    'round4': `${game_result[3].round}`,
                    'avg1704': `${game_result[3].average170}`,
                    'bestshot4': `${game_result[3].best}`,
                    'finish4': `${game_result[3].close}`,
                    'player5': `${game_result[4].name}`,
                    'result5': `${game_result[4].result}`,
                    'round5': `${game_result[4].round}`,
                    'avg1705': `${game_result[4].average170}`,
                    'bestshot5': `${game_result[4].best}`,
                    'finish5': `${game_result[4].close}`,
                    'player6': `${game_result[5].name}`,
                    'result6': `${game_result[5].result}`,
                    'round6': `${game_result[5].round}`,
                    'avg1706': `${game_result[5].average170}`,
                    'bestshot6': `${game_result[5].best}`,
                    'finish6': `${game_result[5].close}`,
                    'winner': `${winners}`,
                    'losers': `${totalsum/winners}`,
                    'players': `${document.getElementById('player_count').value}`,
                }
            ]
        })
    })
}
document.getElementById('finish').addEventListener('click',finish_game);
function finish_game() {
    // game_status[0]=1;
    document.getElementById('fireworks').classList.add('hide');
    document.getElementById('fireworks').pause();
    document.getElementById('darts').classList.add('disabled');
    document.getElementById('next_turn').classList.add('disabled');
    document.getElementById('result_box').classList.add('hide');
    document.getElementById('final_result').classList.remove('hide');
    upgateGameResult();
    editSpreadSheet();
}

function upgateGameResult() {
    let table = document.getElementById('result_table');
    const players_number = document.getElementById('player_count').value;
    const count_legs = [];
    if (game_status[0] == 3) {
        for (let i=0; i<players_number; i+=1) {
            count_legs.push(game_result[i].shots.length);
        } 
    }
    for (let i=0; i<players_number; i+=1) {
        game_result[i].best = Math.max(...game_result[i].shots);
        game_result[i].average170 = Math.round((501-Number(Math.min(...game_result[i].remains.filter((el)=>el>=170))))/game_result[i].remains.filter((el)=>el>=170).length);
        if (game_result[i].finished==1) {
            if (game_status[0]!=3 || (game_status[0]==3 && count_legs[i]==Math.min(...count_legs))){
                game_result[i].result=1;
                winners *= Number(game_result[i].id);
            } else {
                game_result[i].result=0;
            }
            game_result[i].round = game_result[i].shots.length;
            game_result[i].close = game_result[i].shots[game_result[i].shots.length-1];
        }
        const tr = table.insertRow();
        tr.className = 'superrow';
        for (let j=0; j<7; j+=1) {
            const td = tr.insertCell();
            if (j===0) {
                td.className = 'ordercell';
                td.appendChild(document.createTextNode(`${i+1}`));
            } else if (j===1) {
                td.className = 'supercell';
                td.appendChild(document.createTextNode(`${game_result[i].name}`));
            } else if (j===2) {
                td.className = 'supercell';
                td.appendChild(document.createTextNode(`${game_result[i].result}`));
            } else if (j===3) {
                td.className = 'supercell';
                td.appendChild(document.createTextNode(`${game_result[i].round}`));
            } else if (j===4) {
                td.className = 'supercell';
                td.appendChild(document.createTextNode(`${game_result[i].average170}`));
            } else if (j===5) {
                td.className = 'supercell';
                td.appendChild(document.createTextNode(`${game_result[i].best}`));
            } else {
                td.className = 'supercell';
                td.appendChild(document.createTextNode(`${game_result[i].close}`));
            };
        }
    }
}

document.getElementById('continue_this_row').addEventListener('click',finish_game_after_row);
function finish_game_after_row() {
    document.getElementById('fireworks').classList.add('hide');
    document.getElementById('fireworks').pause();
    game_status[0]=2;
    const players_number = document.getElementById('player_count').value;
    for (let i=0; i<players_number; i+=1) {
        if (game_result[i].finished==1) {
            last_leg[0] = game_result[i].shots.length;
        }
    }
    document.getElementById('result_box').classList.add('hide');
    if (Number(current_player)===1) finish_game();
}
document.getElementById('continue_till_loser').addEventListener('click',continue_game_till_loser);
function continue_game_till_loser() {
    document.getElementById('fireworks').classList.add('hide');
    document.getElementById('fireworks').pause();
    game_status[0]=3;
    document.getElementById('result_box').classList.add('hide');
    /* закрыть это окно, каждый бросок проверять, что в игре больше 1 человека, если ложь, то остановить, отправить результаты, заблочить кнопки */
}

