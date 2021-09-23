# Projeto-DS-QUB3D
Projeto desenvolvido para a matéria Desenvolvimento de Sistemas, sendo utilizado HTML, CSS e JS.

## O que é?
QUB³D (pronunciado CUBED), é um minigame encontrado no GTA IV. Baseado em jogos de formar combinações, como Candy Crush e Tetris.

## Como funciona?
- A cada rodada é gerado dois cubos na primeira linha da grade.
- A cada segundo eles descem as linhas, sempre que possível.
- Caso não for possível, é verificado a quantidade de cubos com a mesma cor que estão conectados.
- Caso houver uma conexão de quatro ou mais, é atribuído a pontuação um valor correspondente a quantidade, os cubos conectados apagados e a grade de jogo corrigida.
- Se após essas verificações uma coluna inteira esteja cheia, o jogo será encerrado, com a pontuação final e tempo de jogo exibidos.

## Comandos do Jogador
Durante o jogo, é possível realizar a movimentação dos cubos usando as setas do teclado numérico:
- A seta pra baixo (↓) força o método "moveDown", usado para mover os cubos para a linha abaixo.
- As setas para os lados (← e →) movem eles, respectivamente, para a esquerda e direita, chamando o método "moveSideways".

> Esse comportamento varia de acordo com a quantidade de cubos que está "ativa" (que podem ser movimentados).
> - Caso ambos os cubos estejam ativos, as cores deles serão invertidas.
> - Caso contrário, eles serão movidos normalmente.

## Diferenças entre as versões
No GTA IV, a movimentação dos cubos é diferente pelo fato do mesmo ser tridimensional, o que permite movimentos avançados ao mover para os lados, com os cubos ficando na vertical.

Além disso, a pontuação e distribuição dos cubos funciona pelo fator tempo de jogo; quanto mais tempo passa, mais cores podem aparecer e mais pontos se ganha.

Por fim, é possível fazer combos com cubos de cor vermelha, amarela, verde e azul, cada um com um efeito diferente.

![Design do jogo original](https://static.wikia.nocookie.net/gtawiki/images/6/6b/QUB3D-GTA4-gameplay.jpg/revision/latest?cb=20091030161238)
Design do jogo original - Fonte: https://gta.fandom.com/wiki/QUB3D

Desenvolvido por Anthony Almeida Andrade e Arthur Santiago Diglio.
