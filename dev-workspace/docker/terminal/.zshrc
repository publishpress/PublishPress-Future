export LANG='en_US.UTF-8'
export LANGUAGE='en_US:en'
export LC_ALL='en_US.UTF-8'
[ -z "xterm-256color" ] && export TERM=xterm

##### Zsh/Oh-my-Zsh Configuration
export ZSH="/root/.oh-my-zsh"

ZSH_THEME="ys"
plugins=(git asdf wp-cli )


source $ZSH/oh-my-zsh.sh
