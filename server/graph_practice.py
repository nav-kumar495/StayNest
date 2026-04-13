# # creating a adjecency list
# edges=[(0,1),(0,3),(0,4),(1,2),(1,5),(2,4),(3,4)]
# adj=[]
# n=6
# for i in range(n):
#     adj.append([])

# for edge in edges:
#     x=edge[0]
#     y=edge[1]

#     adj[x].append(y)
#     adj[y].append(x)

#printing edgenceny list
# cout=0
# print("Adjacency_list")
# for i in adj:
#     print(cout,"--->",i)
#     cout=cout+1

# adj_mat = [[0 for _ in range(n)] for _ in range(n)]
# for i in range(n):
#     for j in range(n):
#         adj_mat[i][j]=0


# for edge in edges:
#     x=edge[0]
#     y=edge[1]

#     adj_mat[x][y]=1
#     adj_mat[y][x]=1

# #printing adjacency matrix
# print("adjacency_matrix")

# for i in range(n):
#     for j in range(n):
#         print(adj_mat[i][j],end=" ")
#     print()


#graph traversal bradth first search..........
# q=[]
# visited=[False]*n
# ans=[]

# q.append(0)
# visited[0]=True
# ans.append(0)

# while len(q)>0:
#     frount=q.pop(0)
#     for neighbour in adj[frount]:
#         if visited[neighbour]==False:
#             q.append(neighbour)
#             ans.append(neighbour)
#             visited[neighbour]=True

# print(ans)


#depth fist search using recursion....
# visited=[False]*n
# ans=[]

# def dfs(i,adj,visited):
#     visited[i]=True
#     ans.append(i)

#     for x in adj[i]:
#         if not visited[x]:
#             dfs(x,adj,visited)

# dfs(0,adj,visited)
# print(ans)

#detecting cycle in a undirected graph using dfs.....recursion
# visited=[False]*n 

# def dfs(i,parent,adj,visited):
#     visited[i]=True
#     for x in adj[i]:
#         if(x==parent):
#             continue
#         if(visited[x]==True):
#             return True
#         if dfs(x,i,adj,visited):
#             return True
# print(dfs(0,-1,adj,visited))


#prims algorith for minimu spanning tree.....

adj_mat=[[0,9,75,0,0],[9,0,95,19,42],[75,95,0,51,66],[0,19,51,0,31],[0,42,66,31,0]]
print(adj_mat[0][1])

def prims(adj_mat):
    n=len(adj_mat)
    visted=[False]*n 
    visted[0]=True
    total=0
    for _ in range(n-1):
        mini=9999
        for i in range(n):
            if visted[i]:
                for j in range(n):
                    if not visted[j] and adj_mat[i][j]!=0:
                        if adj_mat[i][j]<mini:
                            mini=adj_mat[i][j]
                            x=i
                            y=j
        total=total+adj_mat[x][y]
        visted[y]=True
    print(total)

prims(adj_mat)



            









   


       



