/*Константы */
const player_points = [501,501,501,501,501,501];
const all_points = {1:[],2:[],3:[],4:[],5:[],6:[]};
const final_countdown = {1:[],2:[],3:[],4:[],5:[],6:[]};
const coords = {1:{x:[],y:[]},2:{x:[],y:[]},3:{x:[],y:[]},4:{x:[],y:[]},5:{x:[],y:[]},6:{x:[],y:[]}};
const game_finished = [1,1,1,1,1,1];

/*После выбора числа игроков написать имена*/
document.getElementById('player_count').addEventListener('change', addNames);
function addNames() {
    document.getElementById('players_name').innerHTML='';
    document.getElementById('start_button').classList.add('hide');
    const players_number = document.getElementById('player_count').value;
    if (!isNaN(players_number)) {
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

/*После ввода имен старт игры - убирает окно настроек, открывает окно игры*/
document.getElementById('start_button').addEventListener('click', startGame);
function startGame() {
    document.getElementById('game_settings').classList.add('hide');
    document.getElementById('game_field').classList.remove('hide');
    const players_number = document.getElementById('player_count').value;
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
    console.log('бросаю');
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
        // document.getElementById('throw_sum').innerText = `${result}`;
        marker.id = 'marker_1';
    } else if (dart_left === 2) {
        document.getElementById('throw_2').innerText = `${result}`;
        document.getElementById('throw_2_container').classList.remove('hide');
        // document.getElementById('throw_sum').innerText = `${result+Number(document.getElementById('throw_sum').innerText)}`;
        marker.id = 'marker_2';
    } else if (dart_left === 1) {
        document.getElementById('throw_3').innerText = `${result}`;
        document.getElementById('throw_3_container').classList.remove('hide');
        // document.getElementById('throw_sum').innerText = `${result+Number(document.getElementById('throw_sum').innerText)}`;
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
    all_points[current_player].push(sum);
    final_countdown[current_player].push(player_points[current_player-1]);
    document.querySelectorAll('.superrow')[current_move_number].children[current_player].innerText = `${sum}/${player_points[current_player-1]}`;
    if (Number(current_player) === Number(document.getElementById('player_count').value)) {
        current_player = game_finished.indexOf(0)+1;
        current_move_number +=1;
    } else {
        current_player += 1;
    }
    dart_left = 3;
    document.getElementById('throw_1_container').classList.add('hide');
    document.getElementById('throw_2_container').classList.add('hide');
    document.getElementById('throw_3_container').classList.add('hide');
    document.getElementById('throw_sum').innerText = '';
    document.body.removeChild(document.getElementById('marker_1'));
    document.body.removeChild(document.getElementById('marker_2'));
    document.body.removeChild(document.getElementById('marker_3'));
    nextTurn()
}

/* Обновить графу "Осталось" при бросках */
function updateLeft(score,distance, player, dart_left) {
    const currentLeft = Number(document.getElementById('current_player_left').innerText);
    document.getElementById('current_player_finishing').classList.add('hide');
    if (Number(score) === currentLeft && ((distance > 179 && distance <190)||distance<7.5)) {
        document.getElementById('result_text').innerText = `${document.getElementById(`name_${player}`).value} завершил игру`;
        document.getElementById('result_text').classList.remove('hide');
        setTimeout(()=>{document.getElementById('result_text').classList.add('hide')},3000);
        game_finished[player-1] = 1;
        document.getElementById('next_turn').classList.remove('disabled');
        document.getElementById('current_player_left').innerText = `${currentLeft - Number(score)}`;
        document.getElementById('throw_sum').innerText = `${score+Number(document.getElementById('throw_sum').innerText)}`;
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

/* Удалить результат броска. Реализовать удаление маркеров и координат броска из общего пула координат игрока*/
document.getElementById('delete_1').addEventListener('click',delete1)
function delete1() {
    if (dart_left==2) {
        dart_left=3;
        const fix_number = -Number(document.getElementById('throw_1').innerText);
        updateLeft(fix_number,10, current_player, dart_left);
        document.getElementById('throw_1').innerText = ``;
        document.getElementById('throw_1_container').classList.add('hide');
        document.body.removeChild(document.getElementById('marker_1'));
    }
    if (dart_left==1) {
        dart_left=2;
        const fix_number = -Number(document.getElementById('throw_1').innerText);
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
        const fix_number = -Number(document.getElementById('throw_1').innerText);
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
        const fix_number = -Number(document.getElementById('throw_2').innerText);
        updateLeft(fix_number,10, current_player, dart_left);
        document.getElementById('throw_2').innerText = ``;
        document.getElementById('throw_2_container').classList.add('hide');
        document.body.removeChild(document.getElementById('marker_2'));
    }
    if (dart_left==0) {
        document.getElementById('darts').classList.remove('disabled');
        document.getElementById('next_turn').classList.add('disabled');
        dart_left=1;
        const fix_number = -Number(document.getElementById('throw_2').innerText);
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
        const fix_number = -Number(document.getElementById('throw_3').innerText);
        updateLeft(fix_number,10, current_player, dart_left);
        document.getElementById('throw_3').innerText = ``;
        document.getElementById('throw_3_container').classList.add('hide');
        document.body.removeChild(document.getElementById('marker_3'));
    }
}
