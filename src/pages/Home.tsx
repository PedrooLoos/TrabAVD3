import React, { useState, useEffect } from 'react'
import {
    View, 
    Text, 
    StyleSheet,
    TextInput,
    Platform,
    FlatList, 
    Image
    
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { Button } from '../components/Button'
import { SkillCard } from '../components/SkillCard'

interface Cadastro{
    id: string,
    name: string,
    email: string,
    telefone: string
}

export function Home(){
    const [newNomes, setNewNomes] = useState('')
    const [myNomes, setMyNomes] = useState<Cadastro[]>([])
    const [newEmails, setNewEmails] = useState('')
    const [myEmails, setMyEmails] = useState<Cadastro[]>([])
    const [newTelefones, setNewTelefones] = useState('')
    const [myTelefones, setMyTelefones] = useState<Cadastro[]>([])
    const [greeting, setGreeting] = useState('')

    function handleAddNew(){
        const List = {
            id: String(new Date().getTime()),
            name: newNomes,
            email: newEmails,
            telefone: newTelefones,
        }
        setMyNomes([...myNomes, List])
        setNewNomes('')
        setMyEmails([...myEmails, List])
        setNewEmails('')
        setMyTelefones([...myTelefones, List])
        setNewTelefones('')
    }

    function handleRemove(id: string){
        setMyNomes(myNomes.filter(Cadastro=> Cadastro.id !== id))

    }

    useEffect(() => {
        const currentHour = new Date().getHours();
        if (currentHour >= 5 && currentHour < 12){
            setGreeting('Bom dia!')
        }else if (currentHour >= 12 && currentHour < 18){
            setGreeting('Boa tarde!')
        }else {
            setGreeting('Boa noite!')
        }
    }, [])

    useEffect(() => {
        async function loadData() {
            const storageSkills = await AsyncStorage.getItem('@mynomes:nomes')
            if (storageSkills) {
                setMyNomes(JSON.parse(storageSkills))
            }
        }
        loadData()
    }, [])

    useEffect (() => {
        async function saveData() {
            await AsyncStorage.setItem('@mynomes:nomes', JSON.stringify(myNomes))
        }
        saveData()
    }, [myNomes])

    return(
        <>
        <View style={styles.container}>
            <Image style={{height:150,width:200,alignSelf:'center', justifyContent: 'center', marginBottom: 5}} source={require('../assets/next_digital_whitebg.png')}/>

            <Text style={styles.greetings}>
                    {greeting}
             </Text>
            <Text style={styles.title}>Cadastro no Banco NEXT</Text>
           
            <TextInput
                    style={styles.input}
                    placeholder= 'Digite seu nome...'
                    value={newNomes}
                    placeholderTextColor='#555'
                    onChangeText={value => setNewNomes(value)}
                    onSubmitEditing={handleAddNew}
                    blurOnSubmit
            />

            <TextInput
                style={styles.input}
                placeholder= 'Digite seu email...'
                value={newEmails}
                placeholderTextColor='#555'
                onChangeText={value => setNewEmails(value)}
                onSubmitEditing={handleAddNew}
                blurOnSubmit
            />

            <TextInput
                style={styles.input}
                placeholder= 'Digite seu telefone...'
                keyboardType="numeric"
                value={newTelefones}
                placeholderTextColor='#555'
                onChangeText={value => setNewTelefones(value)}
                onSubmitEditing={handleAddNew}
                blurOnSubmit
            />

            <Button
                title = 'Cadastrar'
                onPress={handleAddNew}
            />

            <Text style={styles.title}>
                Listagem
            </Text>

            <FlatList showsVerticalScrollIndicator={false}
                data={myNomes}
                keyExtractor={item=> item.id}
                renderItem={({item})=> ( 
                    <SkillCard
                    Nome={item.name}
                    Email={item.email}
                    Telefone={item.telefone}
                    onPress={() => handleRemove(item.id)}
                    />
            )}
            />
            
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#363636',
        paddingHorizontal: 30,
        paddingVertical: 70
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    },
    input: {
        backgroundColor: '#1f1e25',
        color: 'white',
        fontSize: 18,
        marginBottom: 10,
        padding: Platform.OS === 'ios' ? 15 : 12,
        borderRadius: 7
    },
    greetings: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 7,
        textAlign: 'left'
    


    }
})