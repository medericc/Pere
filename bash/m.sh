#!/usr/bin/env bash

# # ville="Tours"
# # echo "Bonjour, $ville"

# # echo="Quel est ton nom?"
# # read name
# # echo "Bonjour, $name! Comment ça va?"

# # tableau=("eee"  "rrr" "ttt")
# # echo "${tableau[2]}"
# # echo "${tableau[@]}"
# # echo "${#tableau[@]}"

# # echo="ta ville?"
# # read ville
# # echo "il fait beau à $ville"

# # -eq -ne -lt -gt -ge -le ( egal dif inf grand sup ou egal inf ou egal)

# # if [ $a -gt $b ]; then
# #     echo "$a est plus grand"
# # elif [ $a -lt $b ]; then
# #     echo "$a est plus petit"
# # else
# #     echo "$a est égal à $b"
# # fi

# if [ -f "m.sh" ]; then
#     echo "Le fichier m.sh existe."
# else
#     echo "Le fichier m.sh n'existe pas."
# fi
# # -d répertoire, -e fichier ou dossier, -s fichier pas vide, -r fichier lisible, -w fichier écrivable, -x fichier exécutable

# read -p "Entrez un nombre: " nombre
# case $nombre in
#     1)
#         echo "Vous avez entré un."
#         ;;
#     2)
#         echo "Vous avez entré deux."
#         ;;
#     3)
#         echo "Vous avez entré trois."
#         ;;
#     *)
#         echo "Nombre non reconnu."
#         ;;
# esac

# read -p "A B C D " choix
# case $choix in
#     A) 
#         echo "A"
#         ;;
#     B)
#         echo "B"
#         ;;
#     *)
#         echo "C ou D"
#         ;;
# esac

# for jour in lundi mardi; do
#     echo "c'est $jour"
# done

# for i in {1..5}; do
#     echo "c:$i"
# done 

# i=1

# while [ $i -le 3 ]; do
#     if [ $i -eq 2 ]; then
#         echo "i vaut 2, on continue"
#         ((i++))
#         continue 
#         # ou break
#     fi
#     echo "i vaut $i"
#     ((i++))
# done

# until [ $i -le 3]; do
#     echo "i vaut $i"
#     ((i++))
# done

# for i in {1..10}; do
#     echo "$i"
# done

# for fichier in *.txt; do
#     echo "$fichier"
# done

# ggg() {
#     echo $(($1 * $1))
# }
# resultat=$(ggg 5)
# echo "carré de 5: $resultat"

# bonjour() {
#     echo "Bonjour, $1!"
# }
# bonjour alice

# somme() {
#     echo $(($1 + $2))
# }

# resultat=$(somme 5 10)
# echo "La somme de 5 et 10 est: $resultat"

# pair() {
#     if [ $(($1 % 2)) -eq 0 ]; then
#         echo "$1 est pair"
#     else
#         echo "$1 est impair"
#     fi 
# }
# pair 2

# fun() {
#         echo "$1"
#         echo "$2" 
# }
# fun "ee" "rr"
# $# nombre d arg, $@ liste, indiv "$@""

# read -p "eeee" e
# echo "$(date): $e" > jou.txt ,>> add apres et sort < trier 
# echo "ee"

# alias ll='ls -l'

# source aa.sh ( charge tous le fichier puis variable prete heheh )

# crontab -e
# 0 8 * * * bash /chemin/vers/script.sh 


# declare -A tableau_associatif capitales["France"]="Paris"
# capitales["Allemagne"]="Berlin"

# for tableau_associatif in "$(!capitalize[@])"; do
#     echo "La capitale de $tableau_associatif est ${capitales[$tableau_associatif]}"
# done

# erreur 

# set -e ( stoppe direct)
# set -u (erreur si un everiaiable pas deifni est utilsiée)
# set -o pipefail (sans seul le code de retour de l aderniere command est pris en compte, prend erreur dan qchaine de commande/pipeline)
# set -euo pipefail !
# ceel() {
#     echo "Erreur: $1"
#     rm -f /tmp/fichier_temporaire
# }
# trap cleanup EXIT ( dans tou sles cas il sera joué )

# substitituion de commandes : res=$(ls | wc -l) echo"${res}" ( resulatta socké dan svariable

# a=1
# b=2
# ((c = a + b ))
# echo "$c"

# ((compteur++))
# ((x += 2))

# if ((a > b)); then
#     echo "$a est plus grand que $b"
# else
#     echo "$a n'est pas plus grand que $b"
# fi

sed 's/foo/bar/' fichier.txt ( remplace foo par bar dans fichier.txt)     's/foo/bar/g' (remplace toutes les occurrences de foo par bar meme si 2 meme ligne)
sed '/test/d' fichier.txt (supprime les lignes contenant "test" dans fichier.txt)
sed '/title/i ligne avant' fichier.txt (insère "ligne avant" avant chaque ligne contenant "title" dans fichier.txt et /a pour apres append,la c i insert)

cut -d'DELIM' -fCHAMP fichier.txt (-d : definit le délimiteteur par defaut donc tab, -f indiique les champa afficher), extraire colonne avec spearateur
cut -cDEBUT-FIN fichier selectionne un eposotiion de caractere
cut -d',' -f2 fichier.csv (affiche la deuxième colonne de chaque ligne dans fichier.csv)
cut -c1-5 fichier.txt (affiche les 5 premiers caractères de chaque ligne dans fichier.txt)
cut -d':' -f1,3 /etc/password (affiche les premier et troisième champs de chaque ligne dans /etc/passwd)
echo "nom:prenom:age | cut -d':' -f1,2" (affiche le nom et le prénom en utilisant ':' comme délimiteur)

awk '{print $1}' fichier.txt (affiche la première colonne de chaque ligne dans fichier.txt)
awk -F':' '{print $2}' fichier.txt (utilise ':' comme délimiteur et affiche la deuxième colonne de chaque ligne dans fichier.txt)

