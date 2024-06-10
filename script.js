// script.js

document.getElementById('addVantagem').addEventListener('click', () => {
    addDropdown(document.getElementById('vantagensContainer'), 'vantagem');
});

document.getElementById('addDesvantagem').addEventListener('click', () => {
    addDropdown(document.getElementById('desvantagensContainer'), 'desvantagem');
});

document.getElementById('addPericia').addEventListener('click', () => {
    addDropdown(document.getElementById('periciasContainer'), 'pericia');
});

document.getElementById('imageUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('characterImage').src = e.target.result;
    };
    reader.readAsDataURL(file);
});

document.getElementById('saveCharacter').addEventListener('click', () => {
    const characterData = {
        name: document.getElementById('name').value,
        patente: document.getElementById('patente').value,
        history: document.getElementById('history').value,
        attributes: {
            forca: document.getElementById('forca').value,
            habilidade: document.getElementById('habilidade').value,
            resistencia: document.getElementById('resistencia').value,
            armadura: document.getElementById('armadura').value,
            pdf: document.getElementById('pdf').value,
            brilho: document.getElementById('brilho').value
        },
        life: {
            vidaMax: document.getElementById('vidaMax').value,
            danoVida: document.getElementById('danoVida').value,
            vidaAtual: document.getElementById('vidaAtual').value
        },
        mana: {
            manaMax: document.getElementById('manaMax').value,
            danoMana: document.getElementById('danoMana').value,
            manaAtual: document.getElementById('manaAtual').value
        },
        pp: document.getElementById('pp').value,
        vantagens: Array.from(document.getElementsByClassName('vantagem-dropdown')).map(select => select.value),
        desvantagens: Array.from(document.getElementsByClassName('desvantagem-dropdown')).map(select => select.value),
        pericias: Array.from(document.getElementsByClassName('pericia-dropdown')).map(select => select.value),
        resources: document.getElementById('resources').value
    };

    const characterDataStr = JSON.stringify(characterData);
    const blob = new Blob([characterDataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'character.json';
    a.click();
    URL.revokeObjectURL(url);
});

document.getElementById('loadCharacter').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const characterData = JSON.parse(e.target.result);

            document.getElementById('name').value = characterData.name;
            document.getElementById('patente').value = characterData.patente;
            document.getElementById('history').value = characterData.history;
            document.getElementById('forca').value = characterData.attributes.forca;
            document.getElementById('habilidade').value = characterData.attributes.habilidade;
            document.getElementById('resistencia').value = characterData.attributes.resistencia;
            document.getElementById('armadura').value = characterData.attributes.armadura;
            document.getElementById('pdf').value = characterData.attributes.pdf;
            document.getElementById('brilho').value = characterData.attributes.brilho;

            document.getElementById('vidaMax').value = characterData.life.vidaMax;
            document.getElementById('danoVida').value = characterData.life.danoVida;
            document.getElementById('vidaAtual').value = characterData.life.vidaAtual;

            document.getElementById('manaMax').value = characterData.mana.manaMax;
            document.getElementById('danoMana').value = characterData.mana.danoMana;
            document.getElementById('manaAtual').value = characterData.mana.manaAtual;

            document.getElementById('pp').value = characterData.pp;
            document.getElementById('resources').value = characterData.resources;

            const vantagensContainer = document.getElementById('vantagensContainer');
            const desvantagensContainer = document.getElementById('desvantagensContainer');
            const periciasContainer = document.getElementById('periciasContainer');
            vantagensContainer.innerHTML = '';
            desvantagensContainer.innerHTML = '';
            periciasContainer.innerHTML = '';

            characterData.vantagens.forEach(vantagem => {
                addDropdown(vantagensContainer, 'vantagem');
                const dropdown = vantagensContainer.lastChild.querySelector('select');
                dropdown.value = vantagem;
            });

            characterData.desvantagens.forEach(desvantagem => {
                addDropdown(desvantagensContainer, 'desvantagem');
                const dropdown = desvantagensContainer.lastChild.querySelector('select');
                dropdown.value = desvantagem;
            });

            characterData.pericias.forEach(pericia => {
                addDropdown(periciasContainer, 'pericia');
                const dropdown = periciasContainer.lastChild.querySelector('select');
                dropdown.value = pericia;
            });

            calculateLifeMana();
        };
        reader.readAsText(file);
    }
});

document.getElementById('downloadPdf').addEventListener('click', () => {
    html2canvas(document.querySelector('.container')).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save('character.pdf');
    });
});

function addDropdown(container, type) {
    const item = document.createElement('div');
    item.classList.add(`${type}-item`);
    const dropdown = document.createElement('select');
    dropdown.name = type;
    dropdown.classList.add(`${type}-dropdown`);

    let options = '';
    if (type === 'vantagem') {
        options = `
            <option>--- Vantagens únicas ---</option>
                <option value="Aberração Suave">Aberração Suave</option>
                <option value="Aberração Grave">Aberração Grave</option>
                <option value="Brilhante">Brilhante</option>
                <option>--- Habilidades à distância ---</option>
                <option value="Raio de Energia">Raio de Energia</option>
                <option value="Ataque Elemental">Ataque Elemental</option>
                <option value="Tiro Perseguidor">Tiro Perseguidor</option>
                <option value="Disparo Concentrado">Disparo Concentrado</option>
                <option value="Explosão Arcana">Explosão Arcana</option>
                <option>--- Habilidades de Corpo a Corpo ---</option>
                <option value="Golpe Potente">Golpe Potente</option>
                <option value="Fúria Elemental">Fúria Elemental</option>
                <option value="Investida Furiosa">Investida Furiosa</option>
                <option value="Contragolpe">Contragolpe</option>
                <option value="Dança da Lâmina">Dança da Lâmina</option>
                <option>--- Habilidades de Suporte ---</option>
                <option value="Escudo Energético">Escudo Energético</option>
                <option value="Bênção da Força">Bênção da Força</option>
                <option value="Bênção da Velocidade">Bênção da Velocidade</option>
                <option value="Regeneração de Mana Acelerada">Regeneração de Mana Acelerada</option>
                <option value="Regeneração de Vida Acelerada">Regeneração de Vida Acelerada</option>
                <option value="Regeneração Completa">Regeneração Completa</option>
                <option>--- Habilidades de Enfraquecimento ---</option>
                <option value="Maldição Sombria">Maldição Sombria</option>
                <option value="Confusão Mental">Confusão Mental</option>
                <option value="Controle Mental">Controle Mental</option>
                <option value="Veneno Corrosivo">Veneno Corrosivo</option>
                <option value="Pânico">Pânico</option>
                <option value="Cegueira">Cegueira</option>
                <option value="Anular Brilhantes">Anular Brilhantes</option>
                <option>--- Habilidades Passivas ---</option>
                <option value="Fortaleza Natural">Fortaleza Natural</option>
                <option value="Velocidade Aprimorada">Velocidade Aprimorada</option>
                <option value="Aparência Inofensiva">Aparência Inofensiva</option>
                <option value="Resistência Aprimorada">Resistência Aprimorada</option>
                <option value="Aura de Proteção">Aura de Proteção</option>
                <option value="Instinto de Sobrevivência">Instinto de Sobrevivência</option>
                <option value="Regeneração Passiva de Energia">Regeneração Passiva de Energia</option>
                <option value="Regeneração Passiva de Vida">Regeneração Passiva de Vida</option>
                <option value="Sentido de Perigo">Sentido de Perigo</option>
                <option value="Membros Elásticos">Membros Elásticos</option>
                <option value="Membros Extras">Membros Extras</option>
                <option value="Sentidos Especiais">Sentidos Especiais</option>
                <option value="Resistência a Sobrecarga">Resistência a Sobrecarga</option>
                <option value="Telepatia">Telepatia</option>
                <option value="Zona Densa de Mana">Zona Densa de Mana</option>
                <option value="Ataque Múltiplo">Ataque Múltiplo</option>
                <option value="Tiro Múltiplo">Tiro Múltiplo</option>
                <option value="Genialidade">Genialidade</option>
                <option>--- Habilidades Ativas ---</option>
                <option value="Área de Batalha">Área de Batalha</option>
                <option value="Dreno de Energia">Dreno de Energia</option>
                <option value="Dreno de Vitalidade">Dreno de Vitalidade</option>
                <option value="Paralisia Temporária">Paralisia Temporária</option>
                <option value="Aprisionamento">Aprisionamento</option>
                <option value="Fascinação">Fascinação</option>
                <option value="Transformação">Transformação</option>
                <option value="Invisibilidade">Invisibilidade</option>
                <option value="Voo">Voo</option>
                <option value="Ilusões Sensoriais">Ilusões Sensoriais</option>
                <option value="Teleporte Instantâneo">Teleporte Instantâneo</option>
                <option value="Portal de Teleporte">Portal de Teleporte</option>
                <option value="Forma Gasosa">Forma Gasosa</option>
                <option value="Nevoeiro Mágico">Nevoeiro Mágico</option>
                <option value="Invocação de Aliados">Invocação de Aliados</option>
                <option value="Nevoeiro">Nevoeiro</option>
                <option>--- Vantagens Gerais ---</option>
                <option value="Aparência Inofensiva">Aparência Inofensiva</option>
                <option value="Aceleração">Aceleração</option>
                <option value="Aliado">Aliado</option>
                <option value="Arena">Arena</option>
                <option value="Ataque Especial">Ataque Especial</option>
                <option value="Ataque Múltiplo">Ataque Múltiplo</option>
                <option value="Boa Fama">Boa Fama</option>
                <option value="Deflexão">Deflexão</option>
                <option value="Genialidade">Genialidade</option>
                <option value="Inimigo">Inimigo</option>
                <option value="Protagonismo">Protagonismo</option>
                <option value="Paralisia">Paralisia</option>
                <option value="Patrono">Patrono</option>
                <option value="Riqueza">Riqueza</option>
                <option value="Tiro Múltiplo">Tiro Múltiplo</option>
                <option value="Torcida">Torcida</option>
        `;
    } else if (type === 'desvantagem') {
        options = `
            <option value="Ambiente Especial">Ambiente Especial</option>
                <option value="Amnésia">Amnésia</option>
                <option value="Assombrado">Assombrado</option>
                <option value="Bateria">Bateria</option>
                <option value="Conjuração Atrapalhada">Conjuração Atrapalhada</option>
                <option>--- Código de Honra ---</option>
                <option value="1ª Lei de Asimov">1ª Lei de Asimov</option>
                <option value="2ª Lei de Asimov">2ª Lei de Asimov</option>
                <option value="Código de Arena">Código de Arena</option>
                <option value="Código do Caçador">Código do Caçador</option>
                <option value="Código do Cavalheiro">Código do Cavalheiro</option>
                <option value="Código do Combate">Código do Combate</option>
                <option value="Código da Derrota">Código da Derrota</option>
                <option value="Código da Gratidão">Código da Gratidão</option>
                <option value="Código dos Heróis">Código dos Heróis</option>
                <option value="Código da Honestidade">Código da Honestidade</option>
                <option value="Código da Redenção">Código da Redenção</option>
                <option value="Curto Circuito">Curto Circuito</option>
                <option value="Deficiência Física">Deficiência Física</option>
                <option value="Dependência">Dependência</option>
                <option value="Desequilíbrio de Energias">Desequilíbrio de Energias</option>
                <option value="Devoção">Devoção</option>
                <option value="Fetiche">Fetiche</option>
                <option value="Fraqueza">Fraqueza</option>
                <option value="Frágil">Frágil</option>
                <option value="Fúria">Fúria</option>
                <option value="Grito Arcano">Grito Arcano</option>
                <option value="Guia">Guia</option>
                <option value="Inculto">Inculto</option>
                <option>--- Insano ---</option>
                <option value="Cleptomaníaco">Cleptomaníaco</option>
                <option value="Compulsivo">Compulsivo</option>
                <option value="Demente">Demente</option>
                <option value="Depressivo">Depressivo</option>
                <option value="Dupla Personalidade">Dupla Personalidade</option>
                <option value="Distraído">Distraído</option>
                <option value="Fantasia">Fantasia</option>
                <option value="Fobia">Fobia</option>
                <option value="Fúria">Fúria</option>
                <option value="Histérico">Histérico</option>
                <option value="Homicida">Homicida</option>
                <option value="Megalomaníaco">Megalomaníaco</option>
                <option value="Mentiroso">Mentiroso</option>
                <option value="Obsessivo">Obsessivo</option>
                <option value="Paranoico">Paranoico</option>
                <option value="Sonâmbulo">Sonâmbulo</option>
                <option value="Suicida">Suicida</option>
                <option value="Interferência">Interferência</option>
                <option value="Interferência Mágica">Interferência Mágica</option>
                <option value="Lento">Lento</option>
                <option value="Ligação Vital">Ligação Vital</option>
                <option value="Maldição">Maldição</option>
                <option value="Modelo Especial">Modelo Especial</option>
                <option value="Monstruoso">Monstruoso</option>
                <option value="Morto">Morto</option>
                <option value="Munição Limitada">Munição Limitada</option>
                <option value="Má Fama">Má Fama</option>
                <option value="Pacifista">Pacifista</option>
                <option value="Pobreza">Pobreza</option>
                <option value="Poder Vergonhoso">Poder Vergonhoso</option>
                <option value="Poder Vingativo">Poder Vingativo</option>
                <option value="Ponto Fraco">Ponto Fraco</option>
                <option value="Procurado">Procurado</option>
                <option value="Protegido Indefeso">Protegido Indefeso</option>
                <option value="Recuo">Recuo</option>
                <option>--- Restrição de Poder ---</option>
                <option value="Incomum">Incomum</option>
                <option value="Comum">Comum</option>
                <option value="Muito Comum">Muito Comum</option>
                <option value="Segredo">Segredo</option>
                <option value="Sem Mana">Sem Mana</option>
                <option value="Sobrecarga">Sobrecarga</option>
                <option value="Vulnerabilidade">Vulnerabilidade</option>
                <option value="Fora de Controle">Fora de Controle</option>
        `;
    } else if (type === 'pericia') {
        options = `
            <option value="Animais">Animais</option>
                <option value="Arte">Arte</option>
                <option value="Esporte">Esporte</option>
                <option value="Influência">Influência</option>
                <option value="Luta">Luta</option>
                <option value="Manha">Manha</option>
                <option value="Máquinas">Máquinas</option>
                <option value="Medicina">Medicina</option>
                <option value="Brilho">Brilho</option>
                <option value="Percepção">Percepção</option>
                <option value="Saber">Saber</option>
                <option value="Sobrevivência">Sobrevivência</option>
        `;
    }

    dropdown.innerHTML = options;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.classList.add(`remove-${type}`);
    removeBtn.textContent = 'Remover';
    removeBtn.addEventListener('click', () => {
        container.removeChild(item);
    });

    item.appendChild(dropdown);
    item.appendChild(removeBtn);
    container.appendChild(item);
}

function calculateLifeMana() {
    const resistencia = parseInt(document.getElementById('resistencia').value) || 0;
    const habilidade = parseInt(document.getElementById('habilidade').value) || 0;

    const vidaMax = (resistencia * 5) + (parseInt(document.getElementById('vidaMax').dataset.buff) || 0);
    const manaMax = (habilidade * 5) + (parseInt(document.getElementById('manaMax').dataset.buff) || 0);

    document.getElementById('vidaMax').value = vidaMax;
    document.getElementById('manaMax').value = manaMax;

    const danoVida = parseInt(document.getElementById('danoVida').value) || 0;
    const danoMana = parseInt(document.getElementById('danoMana').value) || 0;

    document.getElementById('vidaAtual').value = vidaMax - danoVida;
    document.getElementById('manaAtual').value = manaMax - danoMana;

    if(resistencia == 0){
        vidaMax = 1;
    }
    if(habilidade == 0){
        manaMax = 1;
    }
}

document.querySelectorAll('.attribute-input').forEach(input => {
    input.addEventListener('input', calculateLifeMana);
});

document.querySelectorAll('#danoVida, #danoMana').forEach(input => {
    input.addEventListener('input', calculateLifeMana);
});